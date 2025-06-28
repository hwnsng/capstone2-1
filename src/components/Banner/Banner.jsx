import styled from 'styled-components';
import { useRef, useEffect } from 'react';
import banner1 from '@/media/Banner1.png';
import banner2 from '@/media/Banner2.png';
import banner3 from '@/media/Banner3.png';

function Banner() {
  const intervalRef = useRef(null);
  const currentIndex = useRef(1);

  useEffect(() => {
    const outer = document.querySelector('.outer');
    const innerList = document.querySelector('.inner-list');
    const inners = document.querySelectorAll('.inner');
    const buttonLeft = document.querySelector('.button-left');
    const buttonRight = document.querySelector('.button-right');

    if (!outer || !innerList || inners.length === 0) return;

    const updateWidth = () => {
      inners.forEach((inner) => {
        inner.style.width = `${outer.clientWidth}px`;
      });
      innerList.style.width = `${outer.clientWidth * inners.length}px`;
      moveToIndex(currentIndex.current);
    };

    const moveToIndex = (index) => {
      innerList.style.transition = '0.6s ease-out';
      innerList.style.marginLeft = `-${outer.clientWidth * index}px`;
    };

    const handleLeftClick = () => {
      currentIndex.current = currentIndex.current === 0 ? inners.length - 1 : currentIndex.current - 1;
      moveToIndex(currentIndex.current);
    };

    const handleRightClick = () => {
      currentIndex.current = currentIndex.current === inners.length - 1 ? 0 : currentIndex.current + 1;
      moveToIndex(currentIndex.current);
    };

    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        handleRightClick();
      }, 5000);
    };

    const stopAutoSlide = () => {
      clearInterval(intervalRef.current);
    };

    buttonLeft.addEventListener('click', handleLeftClick);
    buttonRight.addEventListener('click', handleRightClick);

    window.addEventListener('resize', updateWidth);
    updateWidth();
    startAutoSlide();

    return () => {
      buttonLeft.removeEventListener('click', handleLeftClick);
      buttonRight.removeEventListener('click', handleRightClick);
      window.removeEventListener('resize', updateWidth);
      stopAutoSlide();
    };
  }, []);

  return (
    <MainBannerContainer className="outer">
      <MainBannerBox className="inner-list">
        <div className="inner">
          <img src={banner1} alt="첫번째 배너 사진" />
        </div>
        <div className="inner">
          <img src={banner2} alt="두번째 배너 사진" />
        </div>
        <div className="inner">
          <img src={banner3} alt="세번째 배너 사진" />
        </div>
      </MainBannerBox>
      <BannerBtn className="button-left">←</BannerBtn>
      <BannerBtn className="button-right">→</BannerBtn>
    </MainBannerContainer>
  );
}

export default Banner;

const MainBannerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 400px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const MainBannerBox = styled.div`
  display: flex;
  height: 100%;
  transition: 0.6s ease-out;

  .inner {
    flex-shrink: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;
    }
  }
`;

const BannerBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  z-index: 5;
  transition: 0.2s;

  &:hover {
    background-color: #3b6350;
    color: white;
  }

  &.button-left {
    left: 20px;
  }

  &.button-right {
    right: 20px;
  }
`;