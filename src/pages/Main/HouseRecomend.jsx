import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function HouseRecomend({ HouseTitle, Region, Price, HouseId, HouseImg }) {
  const navigate = useNavigate();
  const houseImage = `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app${HouseImg}`;
  return (
    <HouseMenuContainer onClick={() => navigate(`/housedetail/${HouseId}`)}>
      <HouseMenuImgBox>
        <img src={houseImage} alt="집 이미지" />
      </HouseMenuImgBox>
      <HouseMenuInfoBox >
        <HouseMenuInfoTitle>
          <h1>제목 : {HouseTitle}</h1>
        </HouseMenuInfoTitle>
        <HouseMenuRegion>
          <h1>지역 : {Region}</h1>
        </HouseMenuRegion>
        <HouseMenuPrice>
          <h1>가격 : {Price}</h1>
        </HouseMenuPrice>
      </HouseMenuInfoBox>
    </HouseMenuContainer>
  )
}

export default HouseRecomend;

const HouseMenuContainer = styled.div`
  width: 22%;
  height: 300px;
  border-radius: 30px;
  border: 1px solid black;
  cursor: pointer;
`;

const HouseMenuImgBox = styled.div`
  display: flex;
  width: 100%;
  height: 60%;
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
  height: 40%;
  padding-left: 17px;
  padding-right: 17px;
  padding-top: 17px;
`;

const HouseMenuInfoTitle = styled.div`
  display: flex;
  width: 100%;
  h1 {
    font-size: 17px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const HouseMenuRegion = styled.div`
  display: flex;
  width: 100%;
  margin-top: 11px;
  h1 {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const HouseMenuPrice = styled.div`
  display: flex;
  width: 100%;
  margin-top: 11px;
  h1 {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
