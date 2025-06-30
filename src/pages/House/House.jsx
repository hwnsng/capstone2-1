import styled from 'styled-components';
import { useState, useEffect } from 'react';
import HouseMenu from '@/components/House/HouseMenu.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '@/components/loading/loading';

function House() {
  const navigate = useNavigate();
  const [houses, setHouses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentGroupStart, setCurrentGroupStart] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageGroupSize = 5;
  const pageGroupEnd = Math.min(currentGroupStart + pageGroupSize - 1, totalPages);

  const visiblePages = Array.from(
    { length: pageGroupEnd - currentGroupStart + 1 },
    (_, i) => currentGroupStart + i
  );

  useEffect(() => {
    fetchHouse();
  }, [page]);

  const fetchHouse = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/houses?page=${page}`
      );
      setHouses(res.data.houses);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
        <PaginationBox>
          <PageNumberBtn onClick={() => setCurrentGroupStart(1)} disabled={currentGroupStart === 1}>
            &laquo;
          </PageNumberBtn>

          <PageNumberBtn
            onClick={() => setCurrentGroupStart(Math.max(1, currentGroupStart - pageGroupSize))}
            disabled={currentGroupStart === 1}
          >
            &lsaquo;
          </PageNumberBtn>

          {visiblePages.map((p) => (
            <PageNumberBtn key={p} onClick={() => setPage(p)} className={p === page ? 'active' : ''}>
              {p}
            </PageNumberBtn>
          ))}

          <PageNumberBtn
            onClick={() =>
              setCurrentGroupStart(
                Math.min(currentGroupStart + pageGroupSize, totalPages - ((totalPages - 1) % pageGroupSize))
              )
            }
            disabled={currentGroupStart + pageGroupSize > totalPages}
          >
            &rsaquo;
          </PageNumberBtn>

          <PageNumberBtn
            onClick={() =>
              setCurrentGroupStart(totalPages - ((totalPages - 1) % pageGroupSize) + 1)
            }
            disabled={currentGroupStart + pageGroupSize > totalPages}
          >
            &raquo;
          </PageNumberBtn>
        </PaginationBox>
      </HouseMainBox>
      {loading && <Loading />}
    </HouseContainer>
  );
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
  h1 {
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
  button {
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

const PaginationBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 10px;
  flex-wrap: wrap;
`;

const PageNumberBtn = styled.button`
  background: #ffffff;
  color: #538572;
  border: 1px solid #538572;
  border-radius: 10px;
  font-size: 16px;
  padding: 10px 14px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #538572;
    color: white;
  }
  &.active {
    background-color: #538572;
    color: white;
    font-weight: bold;
  }
`;
