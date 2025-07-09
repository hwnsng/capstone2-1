import styled from 'styled-components';
import { toast } from 'react-toastify';
import Logo from '@/media/logo.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import useProfile from '@/hooks/useProfile';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { handleLogout, profileImage } = useProfile();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleChatGo = () => {
    navigate('/chat');
  };
  const handleConfirmLogout = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>정말로 로그아웃 하시겠습니까?</p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 10,
            }}
          >
            <CancelButton onClick={closeToast}>취소</CancelButton>
            <ConfirmButton
              onClick={() => {
                handleLogout();
                closeToast();
              }}
            >
              확인
            </ConfirmButton>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  return (
    <MainHeadContainer>
      <MainHeadBox>
        <LogoBox>
          <LogoImg src={Logo} alt="로고" onClick={handleLogoClick} />
        </LogoBox>
        <Nav>
          <Link
            to="/policy"
            className={location.pathname.startsWith('/policy') ? 'active' : ''}
          >
            지원 정책
          </Link>
          <Link
            to="/community?category=0"
            className={
              location.pathname.startsWith('/community') ? 'active' : ''
            }
          >
            커뮤니티
          </Link>
          <Link
            to="/house"
            className={location.pathname.startsWith('/house') ? 'active' : ''}
          >
            주거 공고
          </Link>
          <Link
            to="/aichat"
            className={location.pathname === '/aichat' ? 'active' : ''}
          >
            AI 상담
          </Link>
          <Link
            to="/mentolist"
            className={location.pathname.startsWith('/mento') ? 'active' : ''}
          >
            멘토/멘티
          </Link>
          {isLoggedIn ? (
            <DropdownWrapper ref={dropdownRef}>
              {profileImage && (
                <ProfileImg
                  src={profileImage}
                  alt="프로필사진"
                  onClick={() => setDropdownOpen(prev => !prev)}
                />
              )}
              {dropdownOpen && (
                <DropdownMenu>
                  <DropdownItem onClick={() => navigate('/profile')}>
                    내 프로필
                  </DropdownItem>
                  <DropdownItem onClick={handleChatGo}>내 채팅</DropdownItem>
                  <DropdownItem onClick={handleConfirmLogout}>
                    로그아웃
                  </DropdownItem>
                </DropdownMenu>
              )}
            </DropdownWrapper>
          ) : (
            <Link
              to="/signin"
              className={
                location.pathname === '/signin' ||
                location.pathname === '/signup'
                  ? 'active'
                  : ''
              }
            >
              로그인
            </Link>
          )}
        </Nav>
      </MainHeadBox>
    </MainHeadContainer>
  );
}

export default Header;

const MainHeadContainer = styled.div`
  display: flex;
  position: fixed;
  width: 98vw;
  height: 90px;
  border-bottom: 1px solid rgb(222, 222, 222);
  justify-content: center;
  z-index: 1000;
  background-color: white;
`;

const MainHeadBox = styled.div`
  display: flex;
  width: 100%;
  height: 88px;
  max-width: 1200px;
  justify-content: space-between;
`;

const LogoBox = styled.div`
  display: flex;
  width: 20%;
  align-items: center;
`;

const LogoImg = styled.img`
  width: 200px;
  height: 67px;
  cursor: pointer;
`;

const Nav = styled.div`
  display: flex;
  width: 75%;
  align-items: center;
  justify-content: space-between;
  a {
    color: black;
    text-decoration: none;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    &.active {
      color: #538572;
      text-decoration: underline #538572;
      text-underline-offset: 4px;
    }
  }
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 70px;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: #f2f2f2;
  }
`;

const ConfirmButton = styled.button`
  background-color: #538572;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 8px;
  &:hover {
    background-color: #406a5b;
  }
`;

const CancelButton = styled.button`
  background-color: transparent;
  color: #538572;
  border: 1px solid #538572;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;
