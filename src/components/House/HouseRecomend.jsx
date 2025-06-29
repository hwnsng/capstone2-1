import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function HouseRecomend({ HouseTitle, Region, HouseId, HouseImg }) {
  const navigate = useNavigate();
  return (
    <Wrapper onClick={() => navigate(`/housedetail/${HouseId}`)}>
      <HouseMenuContainer>
        <HouseMenuImgBox>
          <img src={HouseImg} alt="집 이미지" />
          <RegionOverlay>{Region}</RegionOverlay>
        </HouseMenuImgBox>
      </HouseMenuContainer>
      <TitleText>{HouseTitle}</TitleText>
    </Wrapper>
  );
}

export default HouseRecomend;

const Wrapper = styled.div`
  width: 23%;
  cursor: pointer;
  padding-bottom: 20px;
  transition: all 0.2s;
    &:hover{
    transform: scale(1.1);
  }
`;

const HouseMenuContainer = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 20px;
  border: 1px solid #ccc;
  overflow: hidden;
`;

const HouseMenuImgBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  }
`;

const RegionOverlay = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0;
  background-color: #538572;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 6px 14px;
  border-radius: 0 12px 0px 12px;
  max-width: 70%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const TitleText = styled.div`
  margin-top: 12px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #222;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;