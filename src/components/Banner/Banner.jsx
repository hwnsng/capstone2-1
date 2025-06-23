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
    <>
      <MainBannerContainer className="outer">
        <BannerNextBtnBox className="button-list">
          <button className="button-left" style={{ marginLeft: "10px" }}>←</button>
        </BannerNextBtnBox>
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
        <BannerNextBtnBox className="button-list">
          <button className="button-right" style={{ marginRight: "10px" }}>→</button>
        </BannerNextBtnBox>
      </MainBannerContainer>
    </>
  );
}

export default Banner;

const MainBannerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 400px;
  overflow: hidden;
`;

const MainBannerBox = styled.div`
  display: flex;
  height: 100%;
  transition: 0.6s ease-out;
  div {
    flex-shrink: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const BannerNextBtnBox = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;

  &.button-list:first-of-type {
    left: 10px;
  }

  &.button-list:last-of-type {
    right: 10px;
  }

  button {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
`;