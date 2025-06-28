import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '@/components/loading/loading';

function PolicyDetail() {
  const [loading, setLoading] = useState(false);
  const [foundPolicy, setFoundPolicy] = useState(null);

  const path = window.location.pathname;
  const rawPolicyId = path.split("/")[2];
  const policyId = rawPolicyId.includes('?') ? rawPolicyId.split('?')[0] : rawPolicyId;
  const maxPage = 8;

  const fetchPolicyByPages = async () => {
    setLoading(true);
    try {
      for (let page = 1; page <= maxPage; page++) {
        const res = await axios.get(`https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/policy/my?page=${page}`);
        const policies = res.data.content;
        const policy = policies.find(p => p.plcyNo.trim() === policyId.trim());
        if (policy) {
          setFoundPolicy(policy);
          break;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (policyId) {
      fetchPolicyByPages();
    }
  }, [policyId]);

  return (
    <PolicyDetailContainer>
      <PolicyDetailMainBox>
        <PolicyDetailTitleBox>
          {foundPolicy && foundPolicy.plcyNm && (
            <PolicyDetailTitle>{foundPolicy.plcyNm}</PolicyDetailTitle>
          )}
        </PolicyDetailTitleBox>
        <PolicyDetailInfoContainer>
          <div>
            {!foundPolicy && !loading && <div>정책 정보를 찾을 수 없습니다.</div>}
            {foundPolicy && (
              <>
                {foundPolicy.plcyExplnCn && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>정책 설명</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.plcyExplnCn}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.sprvsnInstCdNm && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>주관 부처</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.sprvsnInstCdNm}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.operInstCdNm && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>운영 기관</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.operInstCdNm}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.plcySprtCn && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>지원 내용</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.plcySprtCn}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.plcyAplyMthdCn && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>신청 방법</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.plcyAplyMthdCn}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.aplyUrlAddr && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>신청 페이지</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>
                      <a href={foundPolicy.aplyUrlAddr} target="_blank" rel="noopener noreferrer">
                        {foundPolicy.aplyUrlAddr}
                      </a>
                    </PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.aplyYmd && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>신청 기간</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.aplyYmd}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {(foundPolicy.bizPrdBgngYmd || foundPolicy.bizPrdEndYmd) && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>사업 운영 기간</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>
                      {foundPolicy.bizPrdBgngYmd || "미정"} ~ {foundPolicy.bizPrdEndYmd || "미정"}
                    </PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.srngMthdCn && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>선정 방법</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.srngMthdCn}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.etcMttrCn && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>기타 문의</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.etcMttrCn}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {(foundPolicy.sprtTrgtMinAge || foundPolicy.sprtTrgtMaxAge) && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>지원 가능 연령</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>
                      {foundPolicy.sprtTrgtMinAge || "?"}세 ~ {foundPolicy.sprtTrgtMaxAge || "?"}세
                    </PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.mclsfNm && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>대분류</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.mclsfNm}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.lclsfNm && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>소분류</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.lclsfNm}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
              </>
            )}
          </div>
        </PolicyDetailInfoContainer>
      </PolicyDetailMainBox>
      {loading && <Loading />}
    </PolicyDetailContainer>
  );
}

export default PolicyDetail;

const PolicyDetailContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: 60px 20px 100px;
`;

const PolicyDetailMainBox = styled.div`
  width: 100%;
  margin-top: 80px;
  max-width: 1000px;
`;

const PolicyDetailTitleBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const PolicyDetailTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #538572;
  text-align: center;
`;

const PolicyDetailInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PolicyDetailInfoBox = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const PolicyDetailInfoTitleBox = styled.div`
  width: 25%;
  min-height: 100px;
  background-color: #eaf1ed;
  color: #2f4f4f;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const PolicyDetailInfo = styled.div`
  display: flex;
  width: 75%;
  padding: 16px 20px;
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  word-break: break-word;
  white-space: pre-wrap;
  align-items: center;
  a {
    color: #538572;
    text-decoration: underline;
    &:hover {
      color: #3b6350;
    }
  }
`;