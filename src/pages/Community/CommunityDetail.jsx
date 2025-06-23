import styled from "styled-components";
import axios from "axios";
import { useState, useEffect } from "react";
import Loading from '@/components/loading/loading';
import { useNavigate } from 'react-router-dom';
import EditableComment from './EditableComment';

function CommunityDetail() {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newCComment, setNewCComment] = useState("");
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [likeCheck, setLikeCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const path = window.location.pathname;
  const PostId = path.split("/")[2];
  const [my, setMy] = useState(false);
  const [name, setName] = useState(null);
  const userId = localStorage.getItem("userId");

  const getName = async () => {
    try {
      const response = await axios.get(
        `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/auth/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setName(response.data.userInfo.name);
    } catch (error) {
      console.error('사용자 이름 불러오기 실패', error);
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyTargetId(replyTargetId === commentId ? null : commentId);
  };

  const handleCCommentAdd = async (parentId) => {
    if (newCComment.trim() === "") {
      alert("댓글을 입력해주세요.");
      return;
    }

    if (newCComment.length > 500) {
      alert("댓글은 최대 500자까지 입력할 수 있습니다.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("content", newCComment);
      formData.append("parentId", parentId);

      const res = await axios.post(
        `https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/comments/${PostId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );

      const newCommentData = res.data;
      setComments((prevComments) => [newCommentData, ...prevComments]);
      setNewCComment("");
      setReplyTargetId(null);
      setLoading(false);
    } catch (err) {
      console.error("대댓글 작성 실패:", err);
      alert("대댓글 작성에 실패했습니다.");
      setLoading(false);
    }
  };

  const fetchComments = async (page = 0) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/comments/${PostId}?page=${page}`);
      const validComments = res.data.content.filter(comment => comment.content !== null);
      setComments(prevComments => (page === 0 ? validComments : [...prevComments, ...validComments]));

      if (res.data.number < res.data.totalPages - 1) {
        fetchComments(page + 1);
      }
      setLoading(false);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      alert("댓글을 입력해주세요.");
      return;
    }

    if (newComment.length > 500) {
      alert("댓글은 최대 500자까지 입력할 수 있습니다.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", newComment);
      formData.append("parentId", "");

      const res = await axios.post(
        `https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/comments/${PostId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data"
          },
        }
      );

      const newCommentData = res.data;
      setComments(prevComments => [newCommentData, ...prevComments]);
      setNewComment("");
      setLoading(false);
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성에 실패했습니다.");
      setLoading(false);
    }
  };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/posts/${PostId}`);
      setPost(res.data);
      setLikeCount(res.data.like);
      setLoading(false);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
      setLoading(false);
    }
  };

  const handleClickLike = async () => {
    setLoading(true);
    try {
      await axios.post(
        `https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/posts/${PostId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setLikeCheck(true);
      setLikeCount((prev) => prev + 1);
      setLoading(false);
    } catch (error) {
      console.error("좋아요 처리 실패:", error.response?.data || error.message);
      setLoading(false);
    }
  };


  const checkLiked = async () => {
    setLoading(true);
    try {
      const likeCheckRes = await axios.get("https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/posts/like", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const likedPosts = likeCheckRes.data.content;
      const liked = likedPosts.some(post => post.id == PostId);
      setLikeCheck(liked);
      setLoading(false);
    } catch (error) {
      console.error("좋아요 확인 실패:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  const ClickedUpdate = () => {
    setEditMode(true);
  }

  const handlePostUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("category", post.category);
      formData.append("title", post.title);
      formData.append("content", post.content);

      await axios.patch(
        `https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/posts/${PostId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("게시글이 수정되었습니다.");
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  const handlePostDelete = async () => {
    try {
      await axios.delete(`https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/posts/${PostId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      })
      alert("게시글이 삭제되었습니다.");
      navigate("/community?category=0");
    } catch (err) {
      console.error(err);
      alert("게시글 삭제에 실패했습니다.");
    }
  }

  const handleCommentEdit = async (commentId, content) => {
    try {
      const formData = new FormData();
      formData.append("content", content);

      await axios.patch(
        `https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/comments/${commentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, content } : c))
      );
      alert("댓글이 수정되었습니다.");
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(
        `https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setComments(prev => prev.filter(c => c.id !== commentId));
      alert("댓글이 삭제되었습니다.");
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
    checkLiked();
    getName();
  }, []);

  useEffect(() => {
    if (post && name === post.username) {
      setMy(true);
    }
  }, [post, name]);

  if (!post) return <p>로딩 중...</p>;
  return (
    <CommDetailContainer>
      {!editMode && (
        <MainCommDetailBox>
          {my && (
            <CommDetailBtnBox>
              <button type="button" onClick={ClickedUpdate}>수정</button>
              <button
                type="button"
                onClick={() => {
                  const confirmed = window.confirm("정말로 삭제하시겠습니까?");
                  if (confirmed) handlePostDelete();
                }}
              >삭제</button>
            </CommDetailBtnBox>
          )}

          <CommDetailTitleBox>
            <p>{post.title}</p>
          </CommDetailTitleBox>

          <CommSubTitleBox>
            <CommDetailSubTitle>
              {post.username} | {new Date(post.createdAt).toLocaleDateString("ko-KR")}
            </CommDetailSubTitle>
          </CommSubTitleBox>

          <CommDetailInfoBox>
            <p>
              {post.content}
            </p>
            {post.imageUrls.length != 0 &&
              <img src={post.imageUrls} />
            }
          </CommDetailInfoBox>

          <LikeBtnBox>
            <LikeBtn onClick={handleClickLike}>{likeCheck ? "♥️" : "🖤"}</LikeBtn>
            {likeCount}
          </LikeBtnBox>

          <CommentMainBox>
            <CommentInputWrapper>
              <CommentTextarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요 (최대 500자)"
                maxLength={500}
                rows={1}
              />
              <CommentButton onClick={handleAddComment}>등록</CommentButton>
            </CommentInputWrapper>

            {comments
              .filter((comment) => comment.parentId === null)
              .map((comment) => (
                <div key={comment.id}>
                  <CommentBox>
                    <CommentUserInfo>{comment.username} | </CommentUserInfo>
                    <CommentDetail>
                      {comment.username === name ? (
                        <EditableComment
                          comment={comment}
                          onDelete={() => handleCommentDelete(comment.id)}
                          onEdit={(content) => handleCommentEdit(comment.id, content)}
                        />
                      ) : (
                        comment.content
                      )}
                      <CommentCommentBtnBox>
                        <button onClick={() => handleReplyClick(comment.id)}>답글</button>
                      </CommentCommentBtnBox>
                    </CommentDetail>
                  </CommentBox>

                  {comments
                    .filter((cComment) => cComment.parentId === comment.id)
                    .map((cComment) => (
                      <div key={cComment.id} style={{ paddingLeft: "16px" }}>
                        <CCommentBox>
                          <CCommentUserInfo>{cComment.username} | </CCommentUserInfo>
                          <CCommentDetail>
                            {cComment.username === name ? (
                              <EditableComment
                                comment={cComment}
                                onDelete={() => handleCommentDelete(cComment.id)}
                                onEdit={(content) => handleCommentEdit(cComment.id, content)}
                              />
                            ) : (
                              cComment.content
                            )}
                          </CCommentDetail>
                        </CCommentBox>
                      </div>
                    ))}

                  {replyTargetId === comment.id && (
                    <div style={{ paddingLeft: "16px", marginBottom: "10px" }}>
                      <CommentInputWrapper>
                        <CommentTextarea
                          value={newCComment}
                          onChange={(e) => setNewCComment(e.target.value)}
                          placeholder="대댓글을 입력하세요"
                          maxLength={500}
                          style={{ marginRight: "10px" }}
                        />
                        <CommentButton onClick={() => handleCCommentAdd(comment.id)}>등록</CommentButton>
                      </CommentInputWrapper>
                    </div>
                  )}
                </div>
              ))}
          </CommentMainBox>
        </MainCommDetailBox>
      )}

      {editMode && (
        <MainCommDetailBox>
          <CommDetailBtnBox>
            <button type="button" onClick={handlePostUpdate}>완료</button>
          </CommDetailBtnBox>

          <CommDetailTitleBox>
            <p>제목</p>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              style={{ fontSize: '20px', width: '100%', paddingLeft: "10px", paddingTop: "10px", paddingBottom: "10px" }}
            />
          </CommDetailTitleBox>

          <CommDetailInfoBox>
            <p>내용</p>
            <textarea
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              style={{ width: '100%', height: '300px', fontSize: '18px', paddingLeft: "10px", paddingTop: "10px", fontWeight: "regular" }}
            />
          </CommDetailInfoBox>
        </MainCommDetailBox>
      )}

      {loading && <Loading />}
    </CommDetailContainer>
  );
}

export default CommunityDetail;

const CommDetailContainer = styled.div`
  display: flex;
  width: 99vw;
  justify-content: center;
  min-height: 100vh;
`;

const MainCommDetailBox = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 90%;
  margin-top: 130px;
`;

const CommDetailTitleBox = styled.div`
  margin-bottom: 10px;
  p {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 10px;
  }
`;

const CommSubTitleBox = styled.div`
  font-size: 16px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid black;
`;

const CommDetailSubTitle = styled.p`
  font-size: 16px;
`;

const CommDetailInfoBox = styled.div`
  font-size: 16px;
  min-height: 300px;
  border-bottom: 2px solid black;
  p{
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  img{
    width: 380px;
    height: 330px;
    padding-bottom: 20px;
  }
`;

const LikeBtnBox = styled.div`
  display: flex;
  align-items: center;
  font-size: 25px;
`;

const LikeBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 25px;
`;

const CommentMainBox = styled.div`
  padding: 20px 0px 70px 0px;
`;

const CommentInputWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const CommentTextarea = styled.textarea`
  flex: 1;
  padding: 10px;
  font-size: 16px;
`;

const CommentButton = styled.button`
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
`;

const CommentBox = styled.div`
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
`;

const CommentUserInfo = styled.div`
  margin-right: 10px;
  font-weight: bold;
`;

const CommentDetail = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const CommentCommentBtnBox = styled.div`
  display: flex;
  width: 5%;
  justify-content: center;
  align-items: center;
  button{
    background-color: white;
    border: 1px solid black;
    padding: 3px;
    cursor: pointer;
  }
`;

const CCommentBox = styled.div`
  display: flex;
  padding: 10px 10px;
  border-bottom: 1px solid #ddd;
  background-color: #F1F1F1;
`;

const CCommentUserInfo = styled.div`
  margin-right: 10px;
  font-weight: bold;
`;

const CCommentDetail = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const CommDetailBtnBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  align-items: center;
  button{
  display: flex;
  width: 100px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  border-radius: 50px;
  background-color: white;
  font-size: 17px;
  margin-left: 30px;
  cursor: pointer;
  }
`;
