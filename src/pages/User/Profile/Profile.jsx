import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import useProfile from '@/hooks/useProfile';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [mentoEditBtnOn, setMentoEditBtnOn] = useState(false);

  const {
    name,
    email,
    profileImage,
    handleImageUpload,
    handlePasswordChange,
    handleEmailChange,
    handleLogout
  } = useProfile();

  const profileUrl = `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app${profileImage}`;

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
        <ProfileImageBox>
          <img src={profileUrl} alt="프로필 이미지" />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </ProfileImageBox>
        <UserInfoContainer>
          <UserInfoBox>
            <UserInfo><span>아이디</span>{name}</UserInfo>
            <UserInfo><span>이메일</span>{email}</UserInfo>
            <UserInfo style={{ margin: "0" }}><span>비밀번호</span>********</UserInfo>
          </UserInfoBox>
        </UserInfoContainer>
        <UserInfoChangeBox>
          <UserInfoChangeBtn onClick={handleEmailChange}>이메일 변경</UserInfoChangeBtn>
          <UserInfoChangeBtn onClick={handlePasswordChange}>비밀번호 변경</UserInfoChangeBtn>
          <UserInfoChangeBtn onClick={handleFileClick}>프로필 변경</UserInfoChangeBtn>
          {mentoEditBtnOn && <UserInfoChangeBtn onClick={handleGotoMentoChange}>멘토 정보 수정/삭제</UserInfoChangeBtn>}
          <UserInfoChangeBtn onClick={handleLogout}>로그아웃</UserInfoChangeBtn>
        </UserInfoChangeBox>
      </MainProfBox>
    </ProfileContainer>
  );
}

export default Profile;

const ProfileContainer = styled.div`
  display: flex;
  width: 99vw;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
`;

const MainProfBox = styled.div`
  display: flex;
  width: 85%;
  height: 60%;
`;

const ProfileImageBox = styled.div`
  width: 27%;
  height: 100%;
  img {
    width: 300px;
    height: 300px;
    border-radius: 40px;
  }
`;

const UserInfoContainer = styled.div`
  display: flex;
  width: 50%;
  height: 250px;
  align-items: end;
`;

const UserInfoBox = styled.div`
  width: 100%;
  height: 70%;
`;

const UserInfo = styled.div`
  display: flex;
  width: 100%;
  font-size: 28px;
  margin-bottom: 30px;
  span {
    width: 150px;
    border-right: 2px solid black;
    padding-right: 30px;
    margin-right: 30px;
    text-align: end;
  }
  input {
    background-color: white;
    width: 300px;
    height: 30px;
    font-size: 17px;
  }
`;

const UserInfoChangeBox = styled.div`
  width: 25%;
  height: 100%;
`;

const UserInfoChangeBtn = styled.button`
  display: flex;
  min-width: 200px;
  min-height: 40px;
  font-size: 20px;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 30px;
  background-color: white;
  cursor: pointer;
  margin-bottom: 30px;
`;