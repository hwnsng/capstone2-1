import styled from 'styled-components';
import search from '@/media/search.png';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Loading from '@/components/loading/loading';

function Community() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryString = searchParams.get('category');

  const [searchTitle, setSearchTitle] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(1);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
      setCategory(parseInt(categoryParam));
    }
  }, [location]);

  const SearchTitle = (e) => {
    setSearchTitle(e.target.value);
  };

  const categoryMap = {
    0: '',
    1: 'BLOG',
    2: 'SHARE',
    3: 'QNA',
    4: 'FREE'
  };

  const categoryNameMap = {
    BLOG: '귀촌 블로그',
    SHARE: '귀촌 정보 공유',
    QNA: '귀촌 / 농사 Q&A',
    FREE: '자유 토크'
  };
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 0) params.category = categoryMap[category];
      if (searchTitle.trim() !== "") params.title = searchTitle.trim();

      const res = await axios.get(`https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/posts?page=${page - 1}`, {
        params,
      });
      setTotalPages(res.data.totalPages);
      setPosts(res.data.content);
      setLoading(false);
    } catch (err) {
      console.error('게시글 불러오기 실패:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category, page, searchTitle]);

  const handleSearchClick = () => {
    fetchPosts();
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
    navigate(`?category=${newCategory}&page=${page}`);
  };

  return (
    <CommContainer>
      <MainCommBox>
        <CommTitleBox>커뮤니티</CommTitleBox>

        <CategoryBox>
          <CategoryItem className={queryString == "1" ? "active" : ""} onClick={() => handleCategoryChange(1)}>귀촌 블로그</CategoryItem>
          <CategoryItem className={queryString == "2" ? "active" : ""} onClick={() => handleCategoryChange(2)}>귀촌 정보 공유</CategoryItem>
          <CategoryItem className={queryString == "0" ? "active" : ""} onClick={() => handleCategoryChange(0)}>전체</CategoryItem>
          <CategoryItem className={queryString == "3" ? "active" : ""} onClick={() => handleCategoryChange(3)}>귀촌 / 농사 Q&A</CategoryItem>
          <CategoryItem className={queryString == "4" ? "active" : ""} style={{ border: "none" }} onClick={() => handleCategoryChange(4)}>자유 토크</CategoryItem>
        </CategoryBox>

        <SearchBox>
          <form onSubmit={(e) => e.preventDefault()}>
            <SearchIcon src={search} alt="검색 아이콘" onClick={handleSearchClick} />
            <SearchBar placeholder='제목을 검색해주세요.' value={searchTitle} onChange={SearchTitle} />
          </form>
        </SearchBox>

        <PostListTitle>
          <ListTitleItem style={{ width: "165px" }}>번호</ListTitleItem>
          <ListTitleItem style={{ width: "412px", textAlign: "center" }}>카테고리</ListTitleItem>
          <ListTitleItem style={{ width: "338px", textAlign: "center" }}>제목</ListTitleItem>
          <ListTitleItem style={{ width: "165px" }}>작성자</ListTitleItem>
          <ListTitleItem style={{ width: "100px" }}>작성일</ListTitleItem>
        </PostListTitle>

        <PostList>
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post, idx) => (
              <PostItem onClick={() => navigate(`/community/${post.id}`)} key={idx}>
                <p style={{ paddingLeft: "20px" }}>{post.id}</p>
                <p style={{ width: "130px", textAlign: "center" }}>{categoryNameMap[post.category] || '전체'}</p>
                <p style={{ width: "450px", textAlign: "center" }}>{post.title}</p>
                <p>{post.username}</p>
                <p style={{ paddingRight: "20px" }}>{new Date(post.createdAt).toLocaleDateString()}</p>
              </PostItem>
            ))
          ) : (
            <p>게시글이 없습니다.</p>
          )}
        </PostList>

        <CreateBtnBox>
          <ComCreBtn onClick={() => navigate('/communitycreate')} type="button" value="게시물 작성" />
        </CreateBtnBox>

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
      </MainCommBox>
      {loading && <Loading />}
    </CommContainer>
  );
}

export default Community;

const CommContainer = styled.div`
  display: flex;
  width: 99vw;
  min-height: 100vh;
  justify-content: center;
`;

const MainCommBox = styled.div`
  display: block;
  width: 100%;
  max-width: 1200px;
  margin-top: 130px;
`;

const CommTitleBox = styled.div`
  display: flex;
  width: 100%;
  font-size: 40px;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 20px;
  color: #538572;
`;

const CategoryBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const CategoryItem = styled.div`
  display: flex;
  font-size: 23px;
  font-weight: bold;
  border-right: 2px solid black;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  cursor: pointer;
  &:last-child {
    border-right: none;
  }
  &.active {
    color: #538572;
  }
`;

const SearchBox = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
  form {
    display: flex;
    width: 60%;
    height: 45px;
    background-color: rgb(235, 235, 235);
    justify-content: center;
    align-items: center;
    border-radius: 50px;
  };
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

const PostListTitle = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  background-color: #EEEEEE;
  aligm-items: center;
  margin-top: 30px;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
`;

const ListTitleItem = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  padding-left: 24px;
  color: #538572;
  font-weight: bold;
`;

const PostList = styled.div`
`;

const PostItem = styled.div`
  display: flex;
  padding: 10px;
  padding-top: 20px;
  border-bottom: 2px solid black;
  height: 60px;
  justify-content: space-between;
  cursor: pointer;
`;

const CreateBtnBox = styled.div`
  display: flex;
  width: 100%;
  margin-top: 30px;
  justify-content: end;
  align-items: center;
  padding-bottom: 30px;
`;

const PaginationBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
  padding-bottom: 50px;
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

const ComCreBtn = styled.input`
  width: 130px;
  height: 50px;
  font-size: 20px;
  border-radius: 20px;
  background-color: #538572;
  border: 1px solid #538572;
  color: white;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.2s;
  &:hover{
    background-color:rgb(63, 106, 89);
  }
`;