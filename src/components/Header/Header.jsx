import styled from 'styled-components';
import Logo from '@/media/Logo.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          <Link to="/policy" className={location.pathname === "/policy" ? "active" : ""}>지원 정책</Link>
          <Link to="/community?category=0" className={location.pathname.startsWith("/community") ? "active" : ""}>커뮤니티</Link>
          <Link to="/house" className={location.pathname === "/house" ? "active" : ""}>주거 공고</Link>
          <Link to="/aichat" className={location.pathname === "/aichat" ? "active" : ""}>AI 상담</Link>
          {isLoggedIn ? (
            <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>마이페이지</Link>
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
  width: 100vw;
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
  justify-content: center;
  align-items: center;
`;

const LogoImg = styled.img`
  width: 200px;
  height: 67px;
  cursor: pointer;
`;

const Nav = styled.div`
  display: flex;
  width: 70%;
  align-items: center;
  justify-content: space-between;
  padding-right: 120px;
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