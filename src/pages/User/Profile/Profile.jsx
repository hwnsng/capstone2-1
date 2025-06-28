import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useProfile from '@/hooks/useProfile';
import axios from 'axios';
import Loading from '@/components/loading/loading';

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [mentoEditBtnOn, setMentoEditBtnOn] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    name,
    email,
    profileImage,
    handleImageUpload,
    handlePasswordChange,
    handleEmailChange,
  } = useProfile();

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleImageUpload(file);
    }
    window.location.reload();
  };

  const handleChangeMento = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/mentors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      })
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].mentor_name == name) {
          setMentoEditBtnOn(true);
        }
      }
    } catch (err) {
      console.error("멘토 정보 불러오기 실패, " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (name) {
      handleChangeMento();
    }
  }, [name]);

  const handleGotoMentoChange = () => {
    navigate('/changemento');
  }

  return (
    <ProfileContainer>
      <MainProfBox>
        <TopSection>
          <ProfileImageBox>
            <img src={profileImage} alt="프로필 이미지" />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </ProfileImageBox>
          <UserInfoBox>
            <div><span>아이디</span><p>{name}</p></div>
            <div><span>이메일</span><p>{email}</p></div>
            <div><span>비밀번호</span><p>********</p></div>
          </UserInfoBox>
        </TopSection>

        <Divider />

        <UserInfoChangeBox>
          <UserInfoChangeBtn onClick={handleEmailChange}>이메일 변경</UserInfoChangeBtn>
          <UserInfoChangeBtn onClick={handlePasswordChange}>비밀번호 변경</UserInfoChangeBtn>
          <UserInfoChangeBtn onClick={handleFileClick}>프로필 변경</UserInfoChangeBtn>
          {mentoEditBtnOn && (
            <UserInfoChangeBtn onClick={handleGotoMentoChange}>
              멘토 정보 수정/삭제
            </UserInfoChangeBtn>
          )}
        </UserInfoChangeBox>

        {loading && <Loading />}
      </MainProfBox>
    </ProfileContainer>
  );
}

export default Profile;

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 100px 20px;
  min-height: 100vh;
`;

const MainProfBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0px 10px 30px rgba(0,0,0,0.05);
  padding: 40px;
  margin-top: 100px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  align-items: center;
`;

const ProfileImageBox = styled.div`
  flex-shrink: 0;

  img {
    width: 180px;
    height: 180px;
    border-radius: 100px;
    object-fit: cover;
    border: 3px solid #538572;
  }
`;

const UserInfoBox = styled.div`
  flex-grow: 1;

  div {
    font-size: 20px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;

    span {
      width: 120px;
      font-weight: bold;
      color: #444;
      margin-right: 20px;
      text-align: right;
    }

    p {
      font-size: 20px;
      color: #222;
      margin: 0;
    }
  }
`;

const Divider = styled.div`
  border-top: 1px solid #ddd;
  margin: 30px 0;
`;

const UserInfoChangeBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
`;

const UserInfoChangeBtn = styled.button`
  padding: 14px 24px;
  font-size: 18px;
  font-weight: 500;
  background-color: #538572;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3e6c5e;
  }
`;