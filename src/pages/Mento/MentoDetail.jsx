import styled from "styled-components";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '@/components/loading/loading';


function MentoDetail() {
  const navigate = useNavigate();
  const [mentoName, setMentoName] = useState();
  const [mentoIntroduce, setMentoIntroduce] = useState("");
  const [mentoProfile, setMentoProfile] = useState();
  const [loading, setLoading] = useState(false);
  const path = window.location.pathname;
  const mentoId = path.split("/")[2];
  const mentoProfileUrl = `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/static/profile/${mentoProfile}`;

  const getMentos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/mentors`, {
      });
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].mentor_id == mentoId) {
          setMentoName(res.data[i].mentor_name);
          setMentoIntroduce(res.data[i].introduce);
          setMentoProfile(res.data[i].metor_img);
          break;
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('게시글 불러오기 실패:', err);
      setLoading(false);
    }
  };

  const handleChatGo = async () => {
    try {
      const res = await axios.post(`https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/chats`, {
        mentor_id: parseInt(mentoId),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
      if (res.data.statusCode == 400) {
        alert(res.data.message);
      } else {
        navigate('/chat');
      }
    } catch (err) {
      if (err.status == 401) {
        alert("로그인이 필요한 서비스입니다");
      }
      console.error(err);
    }
  }

  useEffect(() => {
    getMentos();
  }, []);

  return (
    <MentoDetailContainer>
      <MentoDetailMainBox>
        <div>
          <MentoDetailProfileImageBox>
            <img src={mentoProfileUrl} alt="프로필 사진" />
            <MentoDetailUserInfo>
              <span>아이디</span>
              {mentoName}
            </MentoDetailUserInfo>
          </MentoDetailProfileImageBox>
          <MentoListBtnBox>
            <button type="button" onClick={() => {
              const confirmed = window.confirm("채팅을 시작하시겠습니까?");
              if (confirmed) handleChatGo();
            }}>대화하기</button>
          </MentoListBtnBox>
        </div>
        <MentoDetailInfoTitleBox>
          <h1>자기소개</h1>
        </MentoDetailInfoTitleBox>
        <MentoDetailInfoBox>
          {mentoIntroduce}
        </MentoDetailInfoBox>
      </MentoDetailMainBox>
      {loading && <Loading />}
    </MentoDetailContainer>
  )
}

export default MentoDetail;

const MentoDetailContainer = styled.div`
  display: flex;
  min-height: 100vh;
  justify-content: center;
  padding-bottom: 40px;
`;

const MentoDetailMainBox = styled.div`
  width: 90%;
  margin-top: 140px;
  border: 1px solid black;
  > div {
    display: flex;
    width: auto;
  }
`;

const MentoDetailProfileImageBox = styled.div`
  display: flex;
  width: 600px;
  height: 50%;
  padding-left: 30px;
  padding-top: 30px;
  align-items: end;
  img {
    width: 210px;
    height: 210px;
    border-radius: 40px;
  }
`;

const MentoDetailUserInfo = styled.div`
  display: flex;
  width: 300px;
  font-size: 28px;
  margin-bottom: 60px;
  margin-left: 60px;
  span {
    width: 120px;
    height: 40px;
    padding-right: 30px;
    margin-right: 30px;
    border-right: 3px solid black;
  }
`;

const MentoListBtnBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-top: 30px;
  padding-right: 30px;
  button {
    width: 200px;
    height: 40px;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    border-radius: 30px;
    background-color: white;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    margin-right: 30px;
  }
`;


const MentoDetailInfoTitleBox = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  align-items: end;
  padding-left: 40px;
  h1{
    font-size: 25px;
    font-weight: bold;
  }
`;

const MentoDetailInfoBox = styled.div`
  flex: 0 0 94%;
  max-width: 94%;
  padding-left: 10px;
  padding-top: 10px;
  margin-left: 40px;
  height: 210px;
  border: 2px solid black;
  margin-top: 20px;
`;
