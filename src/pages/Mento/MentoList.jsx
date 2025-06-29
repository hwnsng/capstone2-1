import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MentoMenu from '@/components/Mento/MentoMenu';
import { useEffect, useState } from 'react';
import Loading from '@/components/loading/loading';

function MentoList() {
  const navigate = useNavigate();
  const [mentos, setMentos] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMentos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/mentors`, {
      });
      setMentos(res.data);
      setLoading(false);
    } catch (err) {
      console.error('게시글 불러오기 실패:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMentos();
  }, []);

  return (
    <MentoListContainer>
      <MentoListMainBox>
        <MentoListBtnBox>
          <button type="button" onClick={() => navigate('/mentocreate')}>멘토 작성하기</button>
        </MentoListBtnBox>
        <MentoListMenuBox>
          {mentos.map((mento, idx) => (
            <MentoMenu
              onClick={() => navigate(`/mentodetail/${mento.mentor_id}`)}
              key={idx}
              userProfile={mento.metor_img}
              MentoName={mento.mentor_name}
              introduce={mento.introduce}
            />
          ))}
        </MentoListMenuBox>
      </MentoListMainBox>
      {loading && <Loading />}
    </MentoListContainer>
  )
}

export default MentoList;

const MentoListContainer = styled.div`
  display: flex;
  width: 99vw;
  justify-content: center;
  min-height: 100vh;
`;

const MentoListMainBox = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 120px;
`;

const MentoListBtnBox = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  justify-content: right;
  align-items: center;
  button{
    display: flex;
    width: 140px;
    height: 40px;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(54, 98, 81);
    border-radius: 30px;
    background-color:rgb(54, 98, 81);
    color: white; 
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  }
`;

const MentoListMenuBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  width: 100%;
  margin-top: 20px;
`;

