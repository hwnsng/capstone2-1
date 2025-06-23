import styled from 'styled-components';
import { useState } from 'react';
import axios from "@/api/axios";
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/loading/loading';

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
      alert("인증코드 발급 성공");
      setData(res.data);
    } catch (err) {
      setError(err);
      if (err.response) {
        alert("인증코드 에러 발생");
        console.error(err);
      } else {
        alert("서버와의 연결이 끊어졌습니다. 나중에 다시 시도해주세요.");
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
      alert("이메일 변경에 성공했습니다");
      navigate("/profile");
    } catch (err) {
      setError(err);
      if (err.response) {
        alert("비밀번호 변경중 오류가 발생했습니다. 다시 시도해주세요.");
      } else {
        alert("서버와의 연결이 끊어졌습니다. 나중에 다시 시도해주세요.");
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
          <ChangeEmailBtn type="button" value="뒤로" onClick={() => navigate(-1)} />
          <ChangeEmailBtn type="submit" value="변경" onClick={handleChangeEmail} style={{ backgroundColor: "#fff", color: "#000" }} />
        </ChangeEmailBtnBox>
      </ChangeEmailBox>
      {loading && <Loading />}
    </ChangeEmailContainer>
  )
}

export default FindPasswd;

const ChangeEmailContainer = styled.div`
  display: flex;
  width: 99vw;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
`;

const ChangeEmailBox = styled.div`
  width: 90%;
  height: 80%;
`;

const ChangeEmailTitleBox = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  margin-bottom: 40px;
`;

const ChangeEmailTitle = styled.p`
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  margin: 20px 0px;
`;

const ChangeEmailInputBox = styled.div`
  display: flex;
  height: 70px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  justify-content: center;
  align-items: center;
  margin-top: 27px;
  button{
    display: flex;
    width: 100px;
    height: 30px;
    background-color: white;
    border-radius: 30px;
    font-size: 18px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-left: 20px;
  }
`;
const ChangeEmailInputTitleBox = styled.div`
  display: flex;
  width: 15%;
  justify-content: left;
`;
const ChangeEmailInputTitle = styled.p`
  font-size: 21px;
  font-weight: bold;
`;
const ChangeEmailInput = styled.input`
  width: 60%;
  height: 33px;
  font-size: 15px;
  padding-left: 15px;
  border-radius: 10px;
  border: 1px solid black;
  outline: none;
`;

const ChangeEmailBtnBox = styled.div`
  display: flex;
  width: 100%;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
`;

const ChangeEmailBtn = styled.input`
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
