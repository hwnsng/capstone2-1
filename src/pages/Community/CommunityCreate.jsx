import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Loading from '@/components/loading/loading';
import { toast } from 'react-toastify';

function CommunityCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!category) return toast.warning('카테고리를 선택해주세요.');
    if (!title.trim()) return toast.warning('제목을 입력해주세요.');
    if (!content.trim()) return toast.warning('내용을 입력해주세요.');

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('category', category);
    if (image) formData.append('images', image);

    try {
      setLoading(true);
      await axios.post(
        'https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/posts',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      navigate('/community?category=0');
      toast.success('게시글이 등록되었습니다.');
    } catch (err) {
      if (localStorage.getItem('accessToken')) {
        const errorMessage =
          err.response?.data?.message || '게시글 등록 중 오류가 발생했습니다.';
        toast.error(errorMessage);
      } else {
        toast.error('로그인이 필요한 서비스입니다.');
      }
      console.error('게시글 등록 실패:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComContainer>
      <MainComCreBox>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <FieldLabel>카테고리</FieldLabel>
          <Select
            name="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="" disabled>
              카테고리를 선택하세요
            </option>
            <option value="BLOG">귀촌 블로그</option>
            <option value="SHARE">귀촌 정보 공유</option>
            <option value="QNA">귀촌 / 농사 Q&A</option>
            <option value="FREE">자유 토크</option>
          </Select>

          <FieldLabel style={{ marginTop: 16 }}>제목</FieldLabel>
          <ComCreTitleInput
            name="title"
            placeholder="제목을 입력하세요"
            value={title}
            maxLength={25}
            onChange={e => setTitle(e.target.value)}
          />

          <FieldLabel style={{ marginTop: 16 }}>내용</FieldLabel>
          <ComCreDetailInput
            name="content"
            placeholder="내용을 입력해주세요"
            value={content}
            onChange={e => setContent(e.target.value)}
          />

          <FieldLabel style={{ marginTop: 16 }}>이미지 (선택)</FieldLabel>
          <UploadLabel>
            이미지 선택
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </UploadLabel>

          {preview && (
            <ImagePreviewBox>
              <img src={preview} alt="미리보기" />
            </ImagePreviewBox>
          )}

          <ComCreBtnBox>
            <ComCreDelBtn
              type="button"
              value="뒤로"
              onClick={() => navigate(-1)}
            />
            <ComCreBtn type="submit" value="확인" />
          </ComCreBtnBox>
        </form>
      </MainComCreBox>
      {loading && <Loading />}
    </ComContainer>
  );
}

export default CommunityCreate;

const ComContainer = styled.div`
  display: flex;
  width: 99vw;
  min-height: 100vh;
  justify-content: center;
`;

const MainComCreBox = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 120px;
`;

const FieldLabel = styled.h1`
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #538572;
`;

const Select = styled.select`
  width: 100%;
  height: 40px;
  font-size: 16px;
  padding: 0 10px;
`;

const ComCreTitleInput = styled.input`
  width: 100%;
  height: 40px;
  font-size: 16px;
  padding-left: 20px;
  border: 1px solid black;
`;

const ComCreDetailInput = styled.textarea`
  width: 100%;
  height: 250px;
  font-size: 17px;
  padding: 20px;
  border: 1px solid black;
`;

const UploadLabel = styled.label`
  display: inline-block;
  font-size: 14px;
  background-color: #538572;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 8px;
  input {
    display: none;
  }
`;

const ImagePreviewBox = styled.div`
  margin-top: 12px;
  img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 12px;
    object-fit: cover;
    border: 1px solid #ccc;
  }
`;

const ComCreBtnBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  margin-top: 30px;
  padding-bottom: 40px;
`;

const ComCreDelBtn = styled.input`
  width: 130px;
  height: 50px;
  font-size: 23px;
  border-radius: 20px;
  background-color: #fff;
  border: 1px solid #538572;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.2s;
  &:hover {
    background-color: rgb(228, 239, 235);
  }
`;

const ComCreBtn = styled.input`
  width: 130px;
  height: 50px;
  font-size: 23px;
  border-radius: 20px;
  background-color: #538572;
  border: 1px solid #538572;
  color: white;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.2s;
  &:hover {
    background-color: rgb(63, 106, 89);
  }
`;
