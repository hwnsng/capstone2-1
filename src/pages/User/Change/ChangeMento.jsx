import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/loading/loading';
import axios from 'axios';
import { toast } from 'react-toastify';

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
      toast.success("변경이 완료되었습니다");
      setLoading(false);
      navigate('/mentolist');
    } catch (err) {
      if (err.response) {
        toast.error("자기소개 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
      } else {
        toast.error("서버와의 연결이 끊어졌습니다. 나중에 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteMento = async () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>정말로 삭제하시겠습니까?</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={async () => {
                try {
                  await axios.delete(`https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/mentors`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                  });
                  toast.success("멘토멘티 삭제 완료");
                  closeToast();
                  navigate('/mentolist');
                } catch (err) {
                  console.error(err);
                  toast.error("멘토멘티 삭제 실패");
                }
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: '#538572',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              삭제
            </button>
            <button
              onClick={closeToast}
              style={{
                padding: '6px 12px',
                backgroundColor: '#eee',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              취소
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <ChangeMentoContainer>
      <ChangeMentoBox>
        <ChangeMentoTitleBox>
          <ChangeMentoTitle>
            멘토 정보 수정
          </ChangeMentoTitle>
        </ChangeMentoTitleBox>
        <SectionHeader>
          <h1>자기 소개</h1>
          <MentoDeleteBtnBox type="button" onClick={handleDeleteMento}>
            삭제
          </MentoDeleteBtnBox>
        </SectionHeader>
        <MentoCreateInfoInput
          name="content"
          placeholder="소개를 입력해주세요"
          value={introduce}
          onChange={(e) => setIntroduce(e.target.value)}
        />
        <ChangeMentoBtnBox>
          <ChangeMentoBack type="button" value="뒤로" onClick={() => navigate(-1)} />
          <ChangeMentoBtn type="submit" value="변경" onClick={handleChangeMento} />
        </ChangeMentoBtnBox>
      </ChangeMentoBox>
      {loading && <Loading />}
    </ChangeMentoContainer>
  )
}

export default ChangeMento;

const ChangeMentoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
`;

const ChangeMentoBox = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 0 20px;
  margin-top: 150px;
`;

const ChangeMentoTitleBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const ChangeMentoTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #538572;
  margin: 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h1 {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
  }
`;

const MentoDeleteBtnBox = styled.div`
  display: flex;
  width: 100px;
  height: 36px;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 30px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #538572;
    color: #538572;
  }
`;

const MentoCreateInfoInput = styled.textarea`
  width: 100%;
  height: 240px;
  padding: 16px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  resize: vertical;
  outline: none;
`;

const ChangeMentoBtnBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 32px;
`;

const ChangeMentoBack = styled.input`
  width: 130px;
  height: 50px;
  font-size: 23px;
  border-radius: 20px;
  background-color: #fff;
  border: 1px solid #538572;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.2s;
  &:hover{
    background-color:rgb(228, 239, 235);
  }
`;

const ChangeMentoBtn = styled.input`
  width: 130px;
  height: 50px;
  font-size: 23px;
  border-radius: 20px;
  background-color: #538572;
  border: 1px solid #538572;
  color: white;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.2s;
  &:hover{
    background-color:rgb(63, 106, 89);
  }
`;