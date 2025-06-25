import styled from 'styled-components';
import search from '@/media/Search.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/loading/loading';
import axios from 'axios';

function Policy() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [policyInfo, setPolicyInfo] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [leftInputVisible, setLeftInputVisible] = useState(false);
  const [rightInputVisible, setRightInputVisible] = useState(false);
  const [jumpPage, setJumpPage] = useState("");

  const handleJump = (e, side) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(jumpPage);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        setPage(pageNum);
      }

      if (side === "left") setLeftInputVisible(false);
      if (side === "right") setRightInputVisible(false);
      setJumpPage("");
    }
  };

  const handleBlur = (side) => {
    if (side === "left") setLeftInputVisible(false);
    if (side === "right") setRightInputVisible(false);
    setJumpPage("");
  };


  const fetchPolicy = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/policy/my?page=${page}`);
      console.log(res.data.content);
      setPolicyInfo(res.data.content);
      setTotalPages(res.data.totalPages - 1 || 1);
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

        <SearchBox>
          <form onSubmit={(e) => e.preventDefault()}>
            <SearchIcon src={search} alt="검색 아이콘" />
            <SearchBar
              placeholder="제목을 입력해주세요."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
          </form>
        </SearchBox>

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
            </PolicyInfoBox>
          </PolicyInfoContainer>
        ))}
        <PaginationBox>
          {page > 3 && (
            <>
              <PageNumberBtn onClick={() => setPage(1)}>1</PageNumberBtn>
              {!leftInputVisible ? (
                <Dots onClick={() => setLeftInputVisible(true)}>...</Dots>
              ) : (
                <PageInput
                  autoFocus
                  type="number"
                  min="1"
                  max={totalPages}
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  onKeyDown={(e) => handleJump(e, "left")}
                  onBlur={() => handleBlur("left")}
                />
              )}
            </>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 2)
            .map((p) => (
              <PageNumberBtn key={p} onClick={() => setPage(p)} className={p === page ? 'active' : ''}>
                {p}
              </PageNumberBtn>
            ))}
          {page < totalPages - 2 && (
            <>
              {!rightInputVisible ? (
                <Dots onClick={() => setRightInputVisible(true)}>...</Dots>
              ) : (
                <PageInput
                  autoFocus
                  type="number"
                  min="1"
                  max={totalPages}
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  onKeyDown={(e) => handleJump(e, "right")}
                  onBlur={() => handleBlur("right")}
                />
              )}
              <PageNumberBtn onClick={() => setPage(totalPages)}>{totalPages}</PageNumberBtn>
            </>
          )}
        </PaginationBox>
      </PolicyMainBox>

      {loading && <Loading />}
    </PolicyContainer>
  );
}

export default Policy;

const PolicyContainer = styled.div`
  display: flex;
  width: 99vw;
  min-height: 100vh;
  justify-content: center;
  padding-bottom: 60px;
`;

const PolicyMainBox = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 140px;
`;

const PolicyTitleBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const PolicyTitle = styled.h1`
  font-size: 40px;
  font-weight: bold;
`;

const SearchBox = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  form {
    display: flex;
    width: 55%;
    height: 45px;
    background-color: rgb(240, 240, 240);
    justify-content: center;
    align-items: center;
    border-radius: 50px;
  }
`;

const SearchIcon = styled.img`
  display: flex;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const SearchBar = styled.input`
  font-size: 18px;
  border: none;
  outline: none;
  width: 90%;
  background: none;
  padding-left: 20px;
`;

const PolicyInfoContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 30px;
`;

const PolicyInfoBox = styled.div`
  width: 100%;
  padding: 20px 30px;
  border: 1px solid black;
  border-radius: 40px;
  cursor: pointer;
  background-color: #fdfdfd;
`;

const PolicyInfoTitleBox = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const PolicyInfo = styled.div`
  font-size: 18px;
  margin-top: 10px;
`;

const PaginationBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
`;

const PageNumberBtn = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 10px;
  &.active {
    background-color: #74C69D;
    color: white;
    font-weight: bold;
  }
`;

const Dots = styled.span`
  font-size: 18px;
  padding: 6px 10px;
  color: gray;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const PageInput = styled.input`
  width: 50px;
  height: 28px;
  font-size: 16px;
  padding: 0 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  text-align: center;
  outline: none;
`;