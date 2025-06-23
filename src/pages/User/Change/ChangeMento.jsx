import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/loading/loading';
import axios from 'axios';

function ChangeMento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [introduce, setIntroduce] = useState("");

  const handleChangeMento = async () => {
    setLoading(true);
    try {
      await axios.put("https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/mentors", {
        introduce
      }, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("accessToken")}`
        }
      });
      alert("변경이 완료되었습니다");
      setLoading(false);
      navigate('/mentolist');
    } catch (err) {
      if (err.response) {
        alert("자기소개 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      } else {
        alert("서버와의 연결이 끊어졌습니다. 나중에 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteMento = async () => {
    try {
      await axios.delete(`https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/mentors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
      alert("멘토멘티 삭제 완료");
      navigate('/mentolist');
    } catch (err) {
      console.lore(err);
      alert("멘토멘티 삭제 실패");
    }
  }
  return (
    <ChangeMentoContainer>
      <ChangeMentoBox>
        <ChangeMentoTitleBox>
          <ChangeMentoTitle>멘토 정보 수정</ChangeMentoTitle>
        </ChangeMentoTitleBox>
        <MentoDeleteBtnBox>
          <button type="button" onClick={() => {
            const confirmed = window.confirm("정말로 삭제하시겠습니까?");
            if (confirmed) handleDeleteMento();
          }}>삭제</button>
        </MentoDeleteBtnBox>
        <h1>자기 소개</h1>
        <MentoCreateInfoInput
          name="content"
          placeholder="소개를 입력해주세요"
          value={introduce}
          onChange={(e) => setIntroduce(e.target.value)}
        />
        <ChangeMentoBtnBox>
          <ChangeMentoBtn type="button" value="뒤로" onClick={() => navigate(-1)} />
          <ChangeMentoBtn type="submit" value="변경" onClick={handleChangeMento} style={{ backgroundColor: "#fff", color: "#000" }} />
        </ChangeMentoBtnBox>
      </ChangeMentoBox>
      {loading && <Loading />}
    </ChangeMentoContainer>
  )
}

export default ChangeMento;

const ChangeMentoContainer = styled.div`
  display: flex;
  width: 99vw;
  min-height: 100vh;
  justify-content: center;
`;

const ChangeMentoBox = styled.div`
  width: 90%;
  margin-top: 100px;
`;

const ChangeMentoTitleBox = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
`;

const ChangeMentoTitle = styled.p`
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  margin: 20px 0px;
`;

const ChangeMentoBtnBox = styled.div`
  display: flex;
  width: 100%;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
`;

const ChangeMentoBtn = styled.input`
  display: flex;
  width: 130px;
  height: 50px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  background-color: black;
  color: white;
  cursor: pointer;
  margin: 0px 20px;
`;
const MentoCreateInfoInput = styled.textarea`
  width: 100%;
  height: 300px;
  margin-top: 30px;
  font-size: 20px;
  padding: 20px;
  border: 1px solid black;
`;

const MentoDeleteBtnBox = styled.div`
  display: flex;
  width: 100%; 
  height: 70px;
  justify-content: right;
  align-items: center;
  button{
    display: flex;
    width: 100px;
    height: 40px;
    font-size: 18px;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    border-radius: 100px;
    background-color: white;
    cursor: pointer;
  }
`;