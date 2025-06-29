import styled from 'styled-components';
import { useState, useEffect } from 'react'
import HouseMenu from '@/components/House/HouseMenu.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function House() {
  const navigate = useNavigate();
  const page = 1;
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    fetchHouse();
  }, [location, page]);

  const fetchHouse = async () => {
    try {
      const res = await axios.get(
        `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/houses?page=${page}`
      );
      setHouses(res.data.houses);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <HouseContainer>
      <HouseMainBox>
        <HouseMainTitleBox><h1>주거 공고</h1></HouseMainTitleBox>
        <HouseCreateBtnBox>
          <button onClick={() => navigate("/housecreate")}>주거 공고 작성하기</button>
        </HouseCreateBtnBox>
        <HouseMenuMainBox>
          {houses.map((house, index) => (
            <HouseMenu
              key={index}
              houseId={house.id}
              houseImage={house.mainImage}
              houseTitle={house.title}
              region={house.region}
              price={house.price}
            />
          ))}
        </HouseMenuMainBox>
      </HouseMainBox>
    </HouseContainer>
  )
}

export default House;

const HouseContainer = styled.div`
  display: flex;
  width: 99vw;
  justify-content: center;
  padding-bottom: 100px;
  min-height: 100vh;
`;

const HouseMainBox = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 120px;
`;

const HouseMainTitleBox = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
  h1{
    font-size: 40px;
    font-weight: bold;
    color: #538572;
  }
`;

const HouseMenuMainBox = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  width: 100%;
  margin-top: 40px;
`;

const HouseCreateBtnBox = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  justify-content: end;
  align-items: center;
  button{
    display: flex;
    width: 200px;
    height: 50px;
    justify-content: center;
    align-items: center;
    padding: 10px;
    font-size: 20px;
    font-weight: bold;
    border: none;
    border-radius: 30px;
    background-color: #538572;
    color: white;
    cursor: pointer;
  }
`;