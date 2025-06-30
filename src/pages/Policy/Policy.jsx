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
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    progress: 0,
    startAge: '',
    endAge: '',
    organ: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [error, setError] = useState(null);

  const pageGroupSize = 5;
  const pageGroupEnd = Math.min(currentGroupStart + pageGroupSize - 1, totalPages);

  const visiblePages = Array.from(
    { length: pageGroupEnd - currentGroupStart + 1 },
    (_, i) => currentGroupStart + i
  );

  useEffect(() => {
    const fetchPolicy = async () => {
      setLoading(true);
      setError(null);
      try {
        const { progress, startAge, endAge, organ } = appliedFilters;

        const paramsObj = { page, progress };

        if (startAge !== '') {
          const parsedStartAge = parseInt(startAge, 10);
          if (!isNaN(parsedStartAge)) paramsObj.startAge = parsedStartAge;
          else throw new Error('시작 나이는 유효한 숫자여야 합니다.');
        }
        if (endAge !== '') {
          const parsedEndAge = parseInt(endAge, 10);
          if (!isNaN(parsedEndAge)) paramsObj.endAge = parsedEndAge;
          else throw new Error('끝 나이는 유효한 숫자여야 합니다.');
        }
        if (organ && organ.trim() !== '') {
          paramsObj.organ = organ.trim();
        }
        const queryString = Object.entries(paramsObj)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');

        const url = `https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/policy/my?${queryString}`;

        const res = await axios.get(url);

        setPolicyInfo(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalCount(res.data.totalElements || 0);
      } catch (err) {
        console.error('API 요청 실패:', err);
        setError(err.response?.data?.message || err.message || '서버 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, appliedFilters]);

  const handleSearch = () => {
    const { startAge, endAge } = filters;

    if (startAge !== '' && endAge !== '') {
      const parsedStartAge = parseInt(startAge, 10);
      const parsedEndAge = parseInt(endAge, 10);
      if (isNaN(parsedStartAge) || isNaN(parsedEndAge)) {
        setError('나이는 유효한 숫자여야 합니다.');
        return;
      }
      if (parsedStartAge > parsedEndAge) {
        setError('시작 나이는 끝 나이보다 작아야 합니다.');
        return;
      }
    }

    setAppliedFilters(filters);
    setPage(1);
  };

  return (
    <PolicyContainer>
      <PolicyMainBox>
        <PolicyTitleBox>
          <PolicyTitle>지원 정책</PolicyTitle>
        </PolicyTitleBox>
        <FilterBox>
          <label>
            상태:
            <select
              value={filters.progress}
              onChange={(e) => setFilters({ ...filters, progress: Number(e.target.value) })}
            >
              <option value={0}>전체</option>
              <option value={1}>신청 종료</option>
              <option value={2}>신청 중</option>
            </select>
          </label>
          <label>
            나이:
            <input
              type="number"
              placeholder="시작"
              value={filters.startAge}
              onChange={(e) => setFilters({ ...filters, startAge: e.target.value })}
            />
            ~
            <input
              type="number"
              placeholder="끝"
              value={filters.endAge}
              onChange={(e) => setFilters({ ...filters, endAge: e.target.value })}
            />
          </label>
          <label>
            기관명:
            <input
              type="text"
              placeholder="운영 기관"
              value={filters.organ}
              onChange={(e) => {
                setFilters({ ...filters, organ: e.target.value });
              }}
            />
          </label>
          <FilterButton onClick={handleSearch}>검색</FilterButton>
        </FilterBox>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {totalCount > 0 && (
          <TotalCountText>총 {totalCount}건의 지원 정책이 있습니다.</TotalCountText>
        )}
        {policyInfo.map((policy, index) => (
          <PolicyInfoContainer key={index}>
            <PolicyInfoBox onClick={() => navigate(`/policydetail/${policy.plcyNo}?page=${page}`)}>
              <PolicyInfoTitleBox>{policy.plcyNm}</PolicyInfoTitleBox>
              {policy.plcyExplnCn && (
                <PolicyInfo style={{ marginTop: '5px', fontWeight: '500', color: '#333' }}>
                  {policy.plcyExplnCn.length > 100
                    ? policy.plcyExplnCn.slice(0, 100) + '...'
                    : policy.plcyExplnCn}
                </PolicyInfo>
              )}
              <PolicyInfo>
                신청 기간 : {policy.bizPrdBgngYmd || '미정'} ~ {policy.bizPrdEndYmd || '미정'}
              </PolicyInfo>
              <PolicyInfo>운영 기관 : {policy.operInstCdNm || '정보 없음'}</PolicyInfo>
              <PolicyInfo className={policy.end === true ? 'end' : 'ing'}>
                {policy.end === true ? '신청 종료' : '신청 중'}
              </PolicyInfo>
            </PolicyInfoBox>
          </PolicyInfoContainer>
        ))}
        <PaginationBox>
          <PageNumberBtn onClick={() => setCurrentGroupStart(1)} disabled={currentGroupStart === 1}>
            «
          </PageNumberBtn>
          <PageNumberBtn
            onClick={() => setCurrentGroupStart(Math.max(1, currentGroupStart - pageGroupSize))}
            disabled={currentGroupStart === 1}
          >
            ‹
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
            ›
          </PageNumberBtn>
          <PageNumberBtn
            onClick={() =>
              setCurrentGroupStart(totalPages - ((totalPages - 1) % pageGroupSize))
            }
            disabled={currentGroupStart + pageGroupSize > totalPages}
          >
            »
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

const PolicyInfoTitleBox = styled.div`
  font-size: 22px;
  font-weight: 600;
  color: #333;
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

const TotalCountText = styled.p`
  text-align: center;
  font-size: 16px;
  color: #666;
  margin-bottom:  neighbor 20px;
`;

const FilterBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  label {
    font-size: 14px;
    color: #444;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  input,
  select {
    padding: 6px 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
  }
`;

const FilterButton = styled.button`
  background-color: #538572;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #3e6d5f;
  }
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #d95151;
  font-size: 16px;
  margin-bottom: 20px;
`;