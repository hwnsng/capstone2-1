import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const useProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [passwordForDelete, setPasswordForDelete] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfile = async () => {
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
        setEmail(response.data.userInfo.email);
        setProfileImage((response.data.userInfo.profile_image).toString());
      } catch (error) {
        console.error('프로필 정보 불러오기 실패', error);
        toast.error('프로필 정보를 불러오는 데 실패했습니다.');
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.put(
        'https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/auth/change/image',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProfileImage(response.data.profileImagePath);
      toast.success("프로필 사진을 변경했습니다");
      navigate("/profile");
    } catch (error) {
      console.error('프로필 이미지 업로드 실패:', error);
      toast.error("이미지 업로드에 실패했습니다.");
    }
  };

  const handlePasswordChange = () => {
    navigate('/changepasswd');
  };

  const handleEmailChange = () => {
    navigate("/changeemail");
  };

  const handleLogout = async () => {
    try {
      await axios.delete("https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/auth/logout", {
        data: {},
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      navigate("/signin");
      toast.success("로그아웃 되었습니다.");
    } catch (error) {
      toast.error("로그아웃 실패");
      console.error(error);
    }
  };

  return {
    name,
    email,
    profileImage,
    passwordForDelete,
    showDeleteModal,
    setPasswordForDelete,
    setShowDeleteModal,
    handleImageUpload,
    handlePasswordChange,
    handleEmailChange,
    handleLogout
  };
};

export default useProfile;