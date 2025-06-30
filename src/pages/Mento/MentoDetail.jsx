import styled from "styled-components";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '@/components/loading/loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useProfile from '@/hooks/useProfile';

function MentoDetail() {
  const navigate = useNavigate();
  const [mentoName, setMentoName] = useState();
  const [mentoIntroduce, setMentoIntroduce] = useState("");
  const [mentoProfile, setMentoProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [mentoMe, setMentoMe] = useState(null);
  const path = window.location.pathname;
  const mentoId = path.split("/")[2];
  const { name } = useProfile();

  const getMentos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/mentors`);
      const target = res.data.find(m => m.mentor_id == mentoId);
      if (target) {
        setMentoName(target.mentor_name);
        setMentoIntroduce(target.introduce);
        setMentoProfile(target.metor_img);
      }
    } catch (err) {
      console.error('게시글 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChatGo = async () => {
    toast.info(
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ marginBottom: '10px' }}>채팅을 시작하시겠습니까?</span>
        <div>
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.post(`https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/chats`, {
                  mentor_id: parseInt(mentoId),
                }, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                  }
                });
                navigate('/chat');
              } catch (err) {
                if (err.status == 401) {
                  toast.error("로그인이 필요한 서비스입니다");
                }
                console.error(err);
              }
            }}
            style={{ marginRight: '10px', backgroundColor: '#538572', color: 'white', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}
          >
            확인
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{ backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}
          >
            취소
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        closeButton: false
      }
    );
  };

  useEffect(() => {
    getMentos();
  }, []);

  useEffect(() => {
    if (mentoName && name) {
      setMentoMe(mentoName === name);
    }
  }, [mentoName, name]);

  return (
    <MentoDetailContainer>
      <MentoDetailMainBox>
        <HeaderBox>
          <ProfileBox>
            <img src={mentoProfile} alt="프로필 사진" />
            <UserInfo>
              <span>아이디</span>
              {mentoName}
            </UserInfo>
          </ProfileBox>
          {mentoMe === false && (
            <ButtonBox>
              <button type="button" onClick={handleChatGo}>대화하기</button>
            </ButtonBox>
          )}
        </HeaderBox>
        <SectionTitle>
          <h1>자기소개</h1>
        </SectionTitle>
        <IntroduceBox>
          {mentoIntroduce}
        </IntroduceBox>
      </MentoDetailMainBox>
      {loading && <Loading />}
    </MentoDetailContainer>
  );
}

export default MentoDetail;

const MentoDetailContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 120px 20px 60px;
  min-height: 100vh;
`;

const MentoDetailMainBox = styled.div`
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
`;

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
`;

const ProfileBox = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  img {
    width: 160px;
    height: 160px;
    border-radius: 20px;
    object-fit: cover;
    border: 2px solid #538572;
  }
`;

const UserInfo = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #333;
  span {
    margin-right: 16px;
    color: #666;
    border-right: 2px solid #ccc;
    padding-right: 12px;
  }
`;

const ButtonBox = styled.div`
  button {
    background-color: #538572;
    color: white;
    font-size: 16px;
    font-weight: bold;
    border: none;
    padding: 12px 24px;
    border-radius: 24px;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background-color: #3b6350;
    }
  }
`;

const SectionTitle = styled.div`
  margin-top: 40px;
  h1 {
    font-size: 24px;
    font-weight: bold;
    color: #3b6350;
  }
`;

const IntroduceBox = styled.div`
  min-height: 240px;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #a7c8b7;
  border-radius: 12px;
  background-color: #f4fdfa;
  font-size: 18px;
  line-height: 1.6;
  white-space: pre-wrap;
`;