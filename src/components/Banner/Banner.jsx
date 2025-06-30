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

    let inners = document.querySelectorAll('.inner');
    if (!outer || !innerList || inners.length === 0) return;

    const firstClone = inners[0].cloneNode(true);
    const lastClone = inners[inners.length - 1].cloneNode(true);
    innerList.appendChild(firstClone);
    innerList.insertBefore(lastClone, inners[0]);

    inners = document.querySelectorAll('.inner');

    const updateWidth = () => {
      inners.forEach((inner) => {
        inner.style.width = `${outer.clientWidth}px`;
      });
      innerList.style.width = `${outer.clientWidth * inners.length}px`;
      moveToIndex(currentIndex.current, false);
    };

    const moveToIndex = (index, animate = true) => {
      if (animate) {
        innerList.style.transition = '0.6s ease-out';
      } else {
        innerList.style.transition = 'none';
      }
      innerList.style.marginLeft = `-${outer.clientWidth * index}px`;
    };

    const handleRightClick = () => {
      currentIndex.current += 1;
      moveToIndex(currentIndex.current, true);
    };

    const startAutoSlide = () => {
      intervalRef.current = setInterval(() => {
        handleRightClick();
      }, 5000);
    };

    const stopAutoSlide = () => {
      clearInterval(intervalRef.current);
    };

    innerList.addEventListener('transitionend', () => {
      if (currentIndex.current === inners.length - 1) {
        currentIndex.current = 1;
        moveToIndex(currentIndex.current, false);
      }
    });

    window.addEventListener('resize', updateWidth);
    updateWidth();
    startAutoSlide();

    return () => {
      stopAutoSlide();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <MainBannerContainer className="outer">
      <MainBannerBox className="inner-list">
        <div className="inner">
          <img src={banner3} alt="세번째 배너 복제" />
        </div>
        <div className="inner">
          <img src={banner1} alt="첫번째 배너" />
        </div>
        <div className="inner">
          <img src={banner2} alt="두번째 배너" />
        </div>
        <div className="inner">
          <img src={banner3} alt="세번째 배너" />
        </div>
        <div className="inner">
          <img src={banner1} alt="첫번째 배너 복제" />
        </div>
        <div className="inner">
          <img src={banner2} alt="두번째 배너 복제" />
        </div>
      </MainBannerBox>
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
