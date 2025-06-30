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
      if (localStorage.getItem("accessToken")) {
        toast.error("대댓글 작성에 실패했습니다.");
      } else {
        toast.error("로그인이 필요한 서비스입니다.");
      }
      console.error("대댓글 작성 실패:", err);
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
      if (localStorage.getItem("accessToken")) {
        toast.error("댓글 작성에 실패했습니다.");
      } else {
        toast.error("로그인이 필요한 서비스입니다.");
      }
      console.error("댓글 작성 실패:", err);
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
      if (error.response?.status === 500) {
        if (localStorage.getItem("accessToken")) {
          toast.error("이미 좋아요를 누른 게시글입니다.");
        } else {
          toast.error("로그인이 필요합니다.")
        }
      }
      console.error("좋아요 처리 실패:", error.response || error.message);
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
              <ComDetDelBtn type="button" value="삭제" onClick={confirmPostDelete} />
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
            <p>{post.content}</p>
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
              <ComDetSetBtn type="button" value="완료" onClick={handlePostUpdate} />
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
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 40px 20px;
`;

const MainCommDetailBox = styled.div`
  width: 100%;
  max-width: 1200px;
  background: #ffffff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 120px;
`;

const CommDetailTitleBox = styled.div`
  margin-bottom: 20px;
  p {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  input {
    width: 100%;
    font-size: 20px;
    padding: 12px;
    border: 1px solid #a7c8b7;
    border-radius: 8px;
    background-color: #f4fdfa;
    font-family: 'Noto Sans KR', sans-serif;
    &:focus {
      outline: none;
      border-color: #538572;
      box-shadow: 0 0 8px rgba(83, 133, 114, 0.3);
    }
  }
`;

const CommSubTitleBox = styled.div`
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #a7c8b7;
`;

const CommDetailSubTitle = styled.p`
  font-size: 16px;
  color: #538572;
  font-family: 'Noto Sans KR', sans-serif;
`;

const CommDetailInfoBox = styled.div`
  min-height: 300px;
  margin-bottom: 24px;
  border-bottom: 1px solid #a7c8b7;
  p {
    font-size: 17px;
    font-weight: 600;
    margin-bottom: 12px;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  textarea {
    width: 100%;
    height: 400px;
    font-size: 16px;
    padding: 12px;
    border: 1px solid #a7c8b7;
    border-radius: 8px;
    background-color: #f4fdfa;
    font-family: 'Noto Sans KR', sans-serif;
    resize: vertical;
    &:focus {
      outline: none;
      border-color: #538572;
      box-shadow: 0 0 8px rgba(83, 133, 114, 0.3);
    }
  }
`;

const LikeBtnBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  color: #333;
  margin-bottom: 28px;
`;

const LikeBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 26px;
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.2);
  }
`;

const CommentMainBox = styled.div`
  padding: 28px 0;
`;

const CommentBtnBox = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

const CommentDetail = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const CommDetailBtnBox = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 24px;
`;

const ComDetSetBtn = styled.input`
  width: 120px;
  height: 48px;
  font-size: 16px;
  border-radius: 10px;
  background-color: #ffffff;
  border: 2px solid #538572;
  cursor: pointer;
  color: #538572;
  font-family: 'Noto Sans KR', sans-serif;
  transition: all 0.3s ease;
  &:hover {
    background-color: #e4efe8;
  }
`;

const ComDetDelBtn = styled.input`
  width: 120px;
  height: 48px;
  font-size: 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #538572 0%, #406a5b 100%);
  border: none;
  color: white;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  transition: background 0.3s ease;
  &:hover {
    background: linear-gradient(135deg, #406a5b 0%, #2f4c42 100%);
  }
`;

const CommentBox = styled.div`
  background-color: #ffffff;
  border: 1px solid #a7c8b7;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(83, 133, 114, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.3s ease;
  &:hover {
    border-color: #8aa89a;
  }
`;

const CommentUserInfo = styled.div`
  font-weight: 600;
  color: #538572;
  font-size: 15px;
`;

const CommentContent = styled.div`
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
  color: #333;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ReplyButton = styled.button`
  background-color: transparent;
  border: 1px solid #a7c8b7;
  color: #538572;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  font-family: 'Noto Sans KR', sans-serif;
  &:hover {
    background-color: #e4efe8;
    border-color: #538572;
  }
`;

const CCommentBox = styled.div`
  background-color: #f4fdfa;
  border: 1px solid #a7c8b7;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  margin-left: 40px;
  box-shadow: 0 1px 6px rgba(83, 133, 114, 0.1);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.3s ease;
  &:hover {
    border-color: #8aa89a;
  }
`;

const CCommentUserInfo = styled.div`
  font-weight: 600;
  color: #406a5b;
  font-size: 14px;
`;

const CCommentContent = styled.div`
  font-size: 15px;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CommentInputWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const CommentTextarea = styled.textarea`
  flex-grow: 1;
  min-height: 60px;
  border: 1px solid #a7c8b7;
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  resize: vertical;
  background-color: #f4fdfa;
  font-family: 'Noto Sans KR', sans-serif;
  &:focus {
    outline: none;
    border-color: #538572;
    box-shadow: 0 0 6px rgba(83, 133, 114, 0.3);
  }
  &::placeholder {
    color: #a7c8b7;
  }
`;

const CommentButton = styled.button`
  background: linear-gradient(135deg, #538572 0%, #406a5b 100%);
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
  font-family: 'Noto Sans KR', sans-serif;
  align-self: flex-start;
  height: 50px;
  &:hover {
    background: linear-gradient(135deg, #406a5b 0%, #2f4c42 100%);
  }
  &:disabled {
    background: #9dbeb0;
    cursor: not-allowed;
  }
`;