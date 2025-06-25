import styled from 'styled-components';
import Logo from '@/media/Logo.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useProfile from '@/hooks/useProfile';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { handleLogout, profileImage } = useProfile();
  const profileUrl = `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app${profileImage}`;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogoClick = () => {
    navigate('/');
  }

  return (
    <MainHeadContainer>
      <MainHeadBox>
        <LogoBox>
          <LogoImg src={Logo} alt="로고" onClick={handleLogoClick} />
        </LogoBox>
        <Nav>
          <Link to="/policy" className={location.pathname.startsWith("/policy") ? "active" : ""}>지원 정책</Link>
          <Link to="/community?category=0" className={location.pathname.startsWith("/community") ? "active" : ""}>커뮤니티</Link>
          <Link to="/house" className={location.pathname.startsWith("/house") ? "active" : ""}>주거 공고</Link>
          <Link to="/aichat" className={location.pathname === "/aichat" ? "active" : ""}>AI 상담</Link>
          <Link to="/mentolist" className={location.pathname.startsWith("/mento") ? "active" : ""}>멘토/멘티</Link>
          {isLoggedIn ? (
            <ProfileWrapper>
              <Link to="/profile" className={location.pathname === "/profile" || location.pathname === "/changemento" || location.pathname === "/changepasswd" || location.pathname === "/changeemail" ? "active" : ""}>
                <ProfileImg src={profileUrl} alt="프로필사진" />
              </Link>
              <LogoutText
                onClick={() => {
                  const confirmed = window.confirm("정말로 로그아웃 하시겠습니까?");
                  if (confirmed) handleLogout();
                }}
              >
                로그아웃
              </LogoutText>
            </ProfileWrapper>
          ) : (
            <Link
              to="/signin"
              className={location.pathname === "/signin" || location.pathname === "/signup" ? "active" : ""}
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
  width: 99vw;
  height: 90px;
  border-bottom: 1px solid #000;
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
  z-index: 1000;
  background-color: #fff;
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
const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
`;

const LogoutText = styled.span`
  font-size: 14px;
  color: #333;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
