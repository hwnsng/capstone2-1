import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/loading/loading';
import axios from 'axios';

function Policy() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [policyInfo, setPolicyInfo] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentGroupStart, setCurrentGroupStart] = useState(1);

  const pageGroupSize = 5;
  const pageGroupEnd = Math.min(currentGroupStart + pageGroupSize - 1, totalPages);

  const visiblePages = Array.from(
    { length: pageGroupEnd - currentGroupStart + 1 },
    (_, i) => currentGroupStart + i
  );

  const fetchPolicy = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/policy/my?page=${page}`);
      setPolicyInfo(res.data.content);
      setTotalPages(res.data.totalPages - 1 || 1);
      console.log(res.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <PolicyContainer>
      <PolicyMainBox>
        <PolicyTitleBox>
          <PolicyTitle>지원 정책</PolicyTitle>
        </PolicyTitleBox>
        {policyInfo.map((policy, index) => (
          <PolicyInfoContainer key={index}>
            <PolicyInfoBox onClick={() => navigate(`/policydetail/${policy.plcyNo}?${page}`)}>
              <PolicyInfoTitleBox>{policy.plcyNm}</PolicyInfoTitleBox>

              {policy.plcyExplnCn && (
                <PolicyInfo style={{ marginTop: '5px', fontWeight: '500', color: '#333' }}>
                  {policy.plcyExplnCn.length > 100
                    ? policy.plcyExplnCn.slice(0, 100) + '...'
                    : policy.plcyExplnCn}
                </PolicyInfo>
              )}

              <PolicyInfo>신청 기간 : {policy.bizPrdBgngYmd || '미정'} ~ {policy.bizPrdEndYmd || '미정'}</PolicyInfo>
              <PolicyInfo>운영 기관 : {policy.operInstCdNm || '정보 없음'}</PolicyInfo>
              <PolicyInfo className={policy.end == true ? "ing" : "end"}>{policy.end == true ? "신청 중" : "신청 종료"}</PolicyInfo>

            </PolicyInfoBox>
          </PolicyInfoContainer>
        ))}
        <PaginationBox>
          <PageNumberBtn onClick={() => setCurrentGroupStart(1)} disabled={currentGroupStart === 1}>
            &laquo;
          </PageNumberBtn>

          <PageNumberBtn
            onClick={() => setCurrentGroupStart(Math.max(1, currentGroupStart - pageGroupSize))}
            disabled={currentGroupStart === 1}
          >
            &lsaquo;
          </PageNumberBtn>

          {visiblePages.map((p) => (
            <PageNumberBtn key={p} onClick={() => setPage(p)} className={p === page ? 'active' : ''}>
              {p}
            </PageNumberBtn>
          ))}

          <PageNumberBtn
            onClick={() =>
              setCurrentGroupStart(
                Math.min(currentGroupStart + pageGroupSize, totalPages - ((totalPages - 1) % pageGroupSize))
              )
            }
            disabled={currentGroupStart + pageGroupSize > totalPages}
          >
            &rsaquo;
          </PageNumberBtn>

          <PageNumberBtn
            onClick={() =>
              setCurrentGroupStart(totalPages - ((totalPages - 1) % pageGroupSize) + 1)
            }
            disabled={currentGroupStart + pageGroupSize > totalPages}
          >
            &raquo;
          </PageNumberBtn>
        </PaginationBox>

      </PolicyMainBox>

      {loading && <Loading />}
    </PolicyContainer>
  );
}

export default Policy;

const PolicyContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 60px;
`;

const PolicyMainBox = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 120px;
  padding: 0 20px;
`;

const PolicyTitleBox = styled.div`
  display: flex;
  justify-content: center;
`;

const PolicyTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #538572;
  margin-bottom: 30px;
`;

const PolicyInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
`;

const PolicyInfoBox = styled.div`
  width: 100%;
  background-color: white;
  padding: 24px 32px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }
`;

const PolicyInfoTitleBox = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #333;
`;

const PolicyInfo = styled.div`
  font-size: 16px;
  margin-top: 10px;
  color: #555;
  &.ing {
    font-weight: bold;
    color: #538572;
  }
  &.end {
    font-weight: bold;
    color: #d95151;
  }
`;

const PaginationBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 10px;
  flex-wrap: wrap;
`;

const PageNumberBtn = styled.button`
  background: #ffffff;
  color: #538572;
  border: 1px solid #538572;
  border-radius: 10px;
  font-size: 16px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #538572;
    color: white;
  }
  &.active {
    background-color: #538572;
    color: white;
    font-weight: bold;
  }
`;

const Dots = styled.span`
  font-size: 18px;
  color: #999;
  padding: 6px 10px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: #538572;
  }
`;

const PageInput = styled.input`
  width: 60px;
  height: 32px;
  font-size: 16px;
  text-align: center;
  border: 1px solid #538572;
  border-radius: 8px;
  padding: 0 8px;
  outline: none;
  color: #333;
  background-color: white;
  &:focus {
    border-color: #3b6350;
    box-shadow: 0 0 0 2px rgba(83, 133, 114, 0.2);
  }
`;