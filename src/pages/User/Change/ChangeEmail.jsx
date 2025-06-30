import styled from 'styled-components';
import { useState } from 'react';
import axios from "@/api/axios";
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/loading/loading';
import { toast } from 'react-toastify';

function FindPasswd() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setError] = useState(null);
  const [, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const SendToEmailNewEmail = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/auth/sendCode/email", { email: newEmail }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      toast.success("인증코드 발급 성공");
      setData(res.data);
    } catch (err) {
      setError(err);
      if (err.response) {
        toast.error("인증코드 에러 발생");
        console.error(err);
      } else {
        toast.error("서버와의 연결이 끊어졌습니다. 나중에 다시 시도해주세요.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }
  const handleChangeEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put("https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/auth/change/email", {
        newEmail,
        code,
        password,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
      });
      setData(response.data);
      toast.success("이메일 변경에 성공했습니다");
      navigate("/profile");
    } catch (err) {
      setError(err);
      if (err.response) {
        toast.error("이메일 변경중 오류가 발생했습니다. 다시 시도해주세요.");
      } else {
        toast.error("서버와의 연결이 끊어졌습니다. 나중에 다시 시도해주세요.");
      }
      console.error(err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }
  return (
    <ChangeEmailContainer>
      <ChangeEmailBox>
        <ChangeEmailTitleBox>
          <ChangeEmailTitle>이메일 변경</ChangeEmailTitle>
        </ChangeEmailTitleBox>
        <ChangeEmailInputBox>
          <ChangeEmailInputTitleBox>
            <ChangeEmailInputTitle>변경할 이메일</ChangeEmailInputTitle>
          </ChangeEmailInputTitleBox>
          <ChangeEmailInput style={{ width: "52%" }} type="text" value={newEmail} placeholder='변경할 이메일을 입력해주세요.' onChange={(e) => setNewEmail(e.target.value)} />
          <button type="button" onClick={SendToEmailNewEmail}>인증</button>
        </ChangeEmailInputBox>
        <ChangeEmailInputBox>
          <ChangeEmailInputTitleBox>
            <ChangeEmailInputTitle>인증코드</ChangeEmailInputTitle>
          </ChangeEmailInputTitleBox>
          <ChangeEmailInput type="number" value={code} placeholder='인증코드를 입력해주세요.' onChange={(e) => setCode(e.target.value)} />
        </ChangeEmailInputBox>
        <ChangeEmailInputBox>
          <ChangeEmailInputTitleBox>
            <ChangeEmailInputTitle>비밀번호</ChangeEmailInputTitle>
          </ChangeEmailInputTitleBox>
          <ChangeEmailInput type="password" value={password} placeholder='비밀번호를 입력해주세요.' onChange={(e) => setPassword(e.target.value)} />
        </ChangeEmailInputBox>
        <ChangeEmailBtnBox>
          <ChangeEmailBack type="button" value="뒤로" variant="back" onClick={() => navigate(-1)} />
          <ChangeEmailBtn type="submit" value="변경" onClick={handleChangeEmail} />
        </ChangeEmailBtnBox>
      </ChangeEmailBox>
      {loading && <Loading />}
    </ChangeEmailContainer>
  )
}

export default FindPasswd;

const ChangeEmailContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
`;

const ChangeEmailBox = styled.div`
  width: 100%;
  max-width: 700px;
  margin-top: 150px;
`;

const ChangeEmailTitleBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const ChangeEmailTitle = styled.p`
  font-size: 36px;
  font-weight: bold;
  color: #538572;
`;

const ChangeEmailInputBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;

  &:not(:first-of-type) {
    margin-top: 24px;
  }

  button {
    width: 100px;
    height: 36px;
    background-color: white;
    border-radius: 30px;
    font-size: 16px;
    border: 1px solid #538572;
    color: #538572;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

const ChangeEmailInputTitleBox = styled.div`
  flex: 0 0 140px;
`;

const ChangeEmailInputTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
`;

const ChangeEmailInput = styled.input`
  flex: 1;
  height: 36px;
  font-size: 16px;
  padding-left: 14px;
  border-radius: 10px;
  border: 1px solid black;
  outline: none;
`;

const ChangeEmailBtnBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  gap: 20px;
`;

const ChangeEmailBack = styled.input`
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

const ChangeEmailBtn = styled.input`
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