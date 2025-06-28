import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function HouseMenu({ houseImage, houseTitle, price, houseId }) {
  const navigate = useNavigate();
  return (
    <HouseMenuContainer onClick={() => navigate(`/housedetail/${houseId}`)}>
      <HouseMenuImgBox>
        <img src={houseImage} alt="집 이미지" />
      </HouseMenuImgBox>
      <HouseMenuInfoBox >
        <HouseMenuInfoTitle>
          <h1>{houseTitle}</h1>
        </HouseMenuInfoTitle>
        <HouseMenuPrice>
          <h1>가격 : {price}</h1>
        </HouseMenuPrice>
      </HouseMenuInfoBox>
    </HouseMenuContainer>
  )
}

export default HouseMenu;

const HouseMenuContainer = styled.div`
  width: 100%;
  height: 270px;
  border-radius: 30px;
  border: 1px solid rgb(207, 207, 207);
  cursor: pointer;
  box-sizing: border-box;
`;


const HouseMenuImgBox = styled.div`
  display: flex;
  width: 100%;
  height: 70%;
  border-bottom: 1px solid black;
  img{
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: 30px 30px 0px 0px;
  }
`;

const HouseMenuInfoBox = styled.div`
  width: 100%;
  height: 30%;
  padding-left: 17px;
  padding-right: 17px;
  padding-top: 17px;
`;

const HouseMenuInfoTitle = styled.div`
  display: flex;
  width: 100%;
  h1 {
    font-size: 15px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const HouseMenuPrice = styled.div`
  display: flex;
  width: 100%;
  margin-top: 7px;
  h1 {
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
