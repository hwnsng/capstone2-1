import styled from 'styled-components';
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
  const [currentGroupStart, setCurrentGroupStart] = useState(1);
  const pageGroupSize = 5;

  useEffect(() => {
    const expectedGroupStart = Math.floor((page - 1) / pageGroupSize) * pageGroupSize + 1;
    if (currentGroupStart !== expectedGroupStart) {
      setCurrentGroupStart(expectedGroupStart);
    }
  }, [page]);

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

  const categoryColorMap = {
    0: '#999999',
    1: '#538572',
    2: '#FF6B6B',
    3: '#4D96FF',
    4: '#FFC300',
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
          {[0, 1, 2, 3, 4].map((cat) => (
            <CategoryItem
              key={cat}
              className={queryString === String(cat) ? "active" : ""}
              onClick={() => handleCategoryChange(cat)}
            >
              <ColorBox style={{ backgroundColor: categoryColorMap[cat] }} />
              {categoryNameMap[categoryMap[cat]] || "전체"}
            </CategoryItem>
          ))}
        </CategoryBox>

        <PostListTitle>
          <ListTitleItem style={{ width: "80px" }}>번호</ListTitleItem>
          <ListTitleItem style={{ width: "100px" }}>분류</ListTitleItem>
          <ListTitleItem style={{ width: "400px", textAlign: "center" }}>제목</ListTitleItem>
          <ListTitleItem className="right" style={{ width: "95px" }}>글쓴이</ListTitleItem>
          <ListTitleItem className="right" style={{ width: "113px" }}>날짜</ListTitleItem>
          <ListTitleItem className="right" style={{ width: "89px" }}>💚</ListTitleItem>
        </PostListTitle>

        <PostList>
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <PostItem onClick={() => navigate(`/community/${post.id}`)} key={post.id}>
                <p>{post.id}</p>
                <p className="category">{categoryNameMap[post.category] || '전체'}</p>
                <p className="title">{post.title}</p>
                <p className="username">{post.username}</p>
                <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                <p>{post.like}</p>
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
          <PageNumberBtn
            onClick={() => setCurrentGroupStart(1)}
            disabled={currentGroupStart === 1}
          >
            &laquo;
          </PageNumberBtn>

          <PageNumberBtn
            onClick={() => setCurrentGroupStart(Math.max(1, currentGroupStart - pageGroupSize))}
            disabled={currentGroupStart === 1}
          >
            &lsaquo;
          </PageNumberBtn>

          {Array.from({ length: pageGroupSize }, (_, i) => currentGroupStart + i)
            .filter((p) => p <= totalPages)
            .map((p) => (
              <PageNumberBtn
                key={p}
                onClick={() => setPage(p)}
                className={p === page ? 'active' : ''}
              >
                {p}
              </PageNumberBtn>
            ))}

          <PageNumberBtn
            onClick={() =>
              setCurrentGroupStart((prev) =>
                Math.min(prev + pageGroupSize, totalPages - ((totalPages - 1) % pageGroupSize))
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
  margin-top: 120px;
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
  margin: 30px 0;
`;

const PostListTitle = styled.div`
  display: grid;
  grid-template-columns: 100px 200px 1fr 165px 120px 80px;
  height: 50px;
  background-color: rgb(222, 235, 230);
  align-items: center;
  border-radius: 30px 30px 0px 0px;
  margin-top: 30px;
  padding: 0 20px;
  font-weight: bold;
  color: #538572;
  text-align: center;
`;

const ListTitleItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  color: #538572;
  font-weight: bold;

  &.left {
    justify-content: flex-start;
    padding-left: 24px;
  }

  &.right {
    justify-content: flex-end;
    padding-right: 28px;
  }
`;

const PostList = styled.div`
`;

const PostItem = styled.div`
  display: grid;
  grid-template-columns: 100px 200px 1fr 165px 120px 80px;
  align-items: center;
  padding: 20px 10px;
  border-bottom: 1px solid rgb(218, 218, 218);
  cursor: pointer;

  &:hover {
    background-color: #f6f6f6;
  }

  p {
    margin: 0;
    padding: 0;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .category {
    padding-left: 20px;
    text-align: left;
  }

  .title {
    text-align: left;
    padding-left: 10px;
  }

  .username {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: flex-start;
    text-align: left;
    padding-left: 10px;
  }

  .username img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }
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
    background-color: #538572;
    color: white;
    font-weight: bold;
  }
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

const ColorBox = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  margin-right: 8px;
  flex-shrink: 0;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  padding: 6px 12px;
  margin: 0 8px;
  border-radius: 12px;
  cursor: pointer;
  color: #555555;
  background-color: #f0f0f0;
  transition: all 0.2s;

  &.active {
    background-color: #538572;
    color: white;
  }

  &:hover {
    background-color: #d1e5d0;
  }
`;