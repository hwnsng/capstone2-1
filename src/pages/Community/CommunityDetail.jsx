import styled from "styled-components";
import axios from "axios";
import { useState, useEffect } from "react";
import Loading from '@/components/loading/loading';
import { useNavigate } from 'react-router-dom';
import EditableComment from './EditableComment';
import { toast } from 'react-toastify';

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
  const [replyVisibleId, setReplyVisibleId] = useState(null);

  const toggleReplyVisibility = (commentId) => {
    setReplyVisibleId(prev => (prev === commentId ? null : commentId));
  };

  const getName = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyTargetId(replyTargetId === commentId ? null : commentId);
  };

  const handleCCommentAdd = async (parentId) => {
    if (newCComment.trim() === "") {
      toast.warning("댓글을 입력해주세요.");
      return;
    }

    if (newCComment.length > 500) {
      toast.warning("댓글은 최대 500자까지 입력할 수 있습니다.");
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
    } catch (err) {
      console.error("대댓글 작성 실패:", err);
      toast.error("대댓글 작성에 실패했습니다.");
    } finally {
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
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      toast.warning("댓글을 입력해주세요.");
      return;
    }

    if (newComment.length > 500) {
      toast.warning("댓글은 최대 500자까지 입력할 수 있습니다.");
      return;
    }
    setLoading(true);
    try {
      setLoading(true);
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
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      toast.error("댓글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/posts/${PostId}`);
      setPost(res.data);
      setLikeCount(res.data.like);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
    } finally {
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
    } catch (error) {
      console.error("좋아요 처리 실패:", error.response?.data || error.message);
    } finally {
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
    } catch (error) {
      console.error("좋아요 확인 실패:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const ClickedUpdate = () => {
    setEditMode(true);
  }

  const handlePostUpdate = async () => {
    try {
      setLoading(true);
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

      setEditMode(false);
      toast.success("게시글이 수정되었습니다.");
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      toast.error("게시글 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/posts/${PostId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      })
      navigate("/community?category=0");
      toast.success("게시글이 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("게시글 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const handleCommentEdit = async (commentId, content) => {
    setLoading(true);
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
      toast.success("댓글이 수정되었습니다.");
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      toast.error("댓글 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    setLoading(true);
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
      toast.success("댓글이 삭제되었습니다.");
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      toast.error("댓글 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
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

  const confirmPostDelete = () => {
    toast.info(
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ marginBottom: '10px' }}>정말로 게시글을 삭제하시겠습니까?</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              toast.dismiss();
              handlePostDelete();
            }}
            style={{
              backgroundColor: '#538572',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            확인
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              backgroundColor: '#ccc',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        closeButton: false,
      }
    );
  };

  if (!post) return <p>로딩 중...</p>;
  return (
    <CommDetailContainer>
      {!editMode && (
        <MainCommDetailBox>
          {my && (
            <CommDetailBtnBox>
              <ComDetSetBtn type="button" value="수정" onClick={ClickedUpdate} />
              <ComDetDelBtn
                type="button"
                value="삭제"
                onClick={confirmPostDelete}
              />
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
            </CommentInputWrapper>
            <CommentBtnBox>
              <CommentButton onClick={handleAddComment}>댓글 작성</CommentButton>
            </CommentBtnBox>


            {comments
              .filter(comment => comment.parentId === null)
              .map(comment => (
                <div key={comment.id}>
                  <CommentBox>
                    <CommentDetail>
                      <CommentUserInfo>{comment.username}</CommentUserInfo>
                    </CommentDetail>

                    <CommentContent>
                      {comment.username === name ? (
                        <EditableComment
                          comment={comment}
                          onDelete={() => handleCommentDelete(comment.id)}
                          onEdit={(content) => handleCommentEdit(comment.id, content)}
                        />
                      ) : (
                        comment.content
                      )}
                    </CommentContent>

                    <CommentActions>
                      <ReplyButton onClick={() => handleReplyClick(comment.id)}>
                        {replyTargetId === comment.id ? '답글 취소' : '답글 달기'}
                      </ReplyButton>
                      {comments.some(c => c.parentId === comment.id) && (
                        <ReplyButton onClick={() => toggleReplyVisibility(comment.id)}>
                          {replyVisibleId === comment.id ? '답글 숨기기' : '답글 펼치기'}
                        </ReplyButton>
                      )}
                    </CommentActions>
                    {replyVisibleId === comment.id && comments
                      .filter(cComment => cComment.parentId === comment.id)
                      .map(cComment => (
                        <CCommentBox key={cComment.id}>
                          <CCommentUserInfo>{cComment.username}</CCommentUserInfo>
                          <CCommentContent>
                            {cComment.username === name ? (
                              <EditableComment
                                comment={cComment}
                                onDelete={() => handleCommentDelete(cComment.id)}
                                onEdit={(content) => handleCommentEdit(cComment.id, content)}
                              />
                            ) : (
                              cComment.content
                            )}
                          </CCommentContent>
                        </CCommentBox>
                      ))}
                    {replyTargetId === comment.id && (
                      <CommentInputWrapper style={{ marginLeft: "32px" }}>
                        <CommentTextarea
                          value={newCComment}
                          onChange={(e) => setNewCComment(e.target.value)}
                          placeholder="대댓글을 입력하세요 (최대 500자)"
                          maxLength={500}
                        />
                        <CommentButton onClick={() => handleCCommentAdd(comment.id)}>
                          대댓글 작성
                        </CommentButton>
                      </CommentInputWrapper>
                    )}
                  </CommentBox>
                </div>
              ))}
          </CommentMainBox>
        </MainCommDetailBox>
      )
      }

      {
        editMode && (
          <MainCommDetailBox>
            <CommDetailBtnBox>
              <ComDetDelBtn type="button" value="완료" onClick={handlePostUpdate} />
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
              <p style={{ color: "#538572" }}>내용</p>
              <textarea
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                style={{ width: '100%', height: '300px', fontSize: '18px', paddingLeft: "10px", paddingTop: "10px", fontWeight: "regular" }}
              />
            </CommDetailInfoBox>
          </MainCommDetailBox>
        )
      }

      {loading && <Loading />}
    </CommDetailContainer >
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
  margin-top: 120px;
`;

const CommDetailTitleBox = styled.div`
  margin-bottom: 10px;
  p {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #538572;
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

const CommentBtnBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: right;
  padding-bottom: 80px;
`;

const CommentDetail = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const CommDetailBtnBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const ComDetSetBtn = styled.input`
  width: 100px;
  height: 38px;
  font-size: 16px;
  border-radius: 12px;
  background-color: #fff;
  border: 2px solid #538572;
  cursor: pointer;
  color: #538572;
  transition: all 0.2s ease;
  &:hover {
    background-color: #e4efe9;
  }
`;

const ComDetDelBtn = styled.input`
  width: 100px;
  height: 38px;
  font-size: 16px;
  border-radius: 12px;
  background-color: #538572;
  border: 2px solid #538572;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background-color: #3b6350;
  }
`;

const CommentBox = styled.div`
  position: relative;
  background-color: #ffffff;
  border: 1.5px solid #538572;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 14px;
  box-shadow: 0 2px 6px rgba(83, 133, 114, 0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CommentUserInfo = styled.div`
  font-weight: 700;
  color: #538572;
  font-size: 14px;
`;

const CommentContent = styled.div`
  font-size: 16px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  color: #333;
`;

const CommentActions = styled.div`
  margin-top: 6px;
  display: flex;
  gap: 10px;
`;

const ReplyButton = styled.button`
  background-color: transparent;
  border: none;
  color: #538572;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: background-color 0.2s ease;
  font-size: 14px;

  &:hover {
    background-color: #cce5d5;
  }
`;

const CCommentBox = styled.div`
  background-color: #e9f1ec;
  border-radius: 12px;
  border: 1px solid #a3bfa5;
  padding: 10px 16px;
  margin-bottom: 12px;
  margin-left: 32px;
  box-shadow: inset 0 0 4px rgba(83, 133, 114, 0.1);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const CCommentUserInfo = styled.div`
  font-weight: 600;
  color: #3b6350;
  font-size: 13px;
`;

const CCommentContent = styled.div`
  font-size: 15px;
  color: #2a2a2a;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentInputWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const CommentTextarea = styled.textarea`
  flex-grow: 1;
  min-height: 48px;
  border: 2px solid #538572;
  border-radius: 15px;
  padding: 12px 15px;
  font-size: 15px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b7a5b;
    box-shadow: 0 0 6px #3b7a5baa;
  }
`;

const CommentButton = styled.button`
  background-color: #538572;
  border: none;
  border-radius: 50px;
  padding: 0 20px;
  font-size: 15px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  align-self: center;
  height: 44px;

  &:hover {
    background-color: #3b6350;
  }

  &:disabled {
    background-color: #9dbeb0;
    cursor: not-allowed;
  }
`;