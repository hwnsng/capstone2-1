import { useEffect, useState } from 'react';
import styled from 'styled-components';

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    visible && (
      <TopButton onClick={scrollToTop}>
        <div>^</div>
        <div style={{ fontSize: '10px' }}>TOP</div>
      </TopButton>
    )
  );
}

export default ScrollToTopButton;

const TopButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  background-color: black;
  color: white;
  border: none;
  border-radius: 100px;
  width: 50px;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #222;
  }
`;
