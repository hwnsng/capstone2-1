import styled from 'styled-components';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useProfile from '@/hooks/useProfile';
import Loading from '@/components/loading/loading';

function ChangePasswd() {
  const { email } = useProfile();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const SendToEmailPassword = async () => {
    setLoading(true);
    try {
      await axios.post(
        "https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/auth/sendCode/password",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          }
        }
      );
      alert("인증코드 발급 성공");
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다. 다시 로그인해주세요.");
        navigate("/login");
      } else {
        alert("인증코드 요청 중 오류가 발생했습니다.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      await axios.put(
        "https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/auth/authEmail/password",
        {
          code,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          }
        }
      );
      alert("비밀번호 변경을 성공했습니다.");
      navigate("/profile");
    } catch (err) {
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다. 다시 로그인해주세요.");
        navigate("/login");
      } else {
        const msg = err.response?.data?.message?.join('\n') ?? "비밀번호 변경 중 오류가 발생했습니다.";
        alert(msg);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChangeContainer>
      <ChangePassBox>
        <ChangeTitleBox>
          <ChangeTitle>비밀번호 변경</ChangeTitle>
        </ChangeTitleBox>
        <ChangePasswordInputBox>
          <ChangePasswordInputTitleBox>
            <ChangePasswordInputTitle>이메일</ChangePasswordInputTitle>
          </ChangePasswordInputTitleBox>
          <ChangePasswordEmailBox>{email}(이메일 고정)</ChangePasswordEmailBox>
          <button type="button" onClick={SendToEmailPassword}>인증</button>
        </ChangePasswordInputBox>
        <ChangePasswordInputBox>
          <ChangePasswordInputTitleBox>
            <ChangePasswordInputTitle>인증코드</ChangePasswordInputTitle>
          </ChangePasswordInputTitleBox>
          <ChangePasswordInput type="number" value={code} placeholder='인증코드를 입력해주세요.' onChange={(e) => setCode(e.target.value)} />
        </ChangePasswordInputBox>
        <ChangePasswordInputBox>
          <ChangePasswordInputTitleBox>
            <ChangePasswordInputTitle>변경할 비밀번호</ChangePasswordInputTitle>
          </ChangePasswordInputTitleBox>
          <ChangePasswordInput type="password" value={newPassword} placeholder='변경할 비밀번호를 입력해주세요.' onChange={(e) => setNewPassword(e.target.value)} />
        </ChangePasswordInputBox>
        <ChangePasswordBtnBox>
          <ChangePasswordBtn type="button" value="뒤로" onClick={() => navigate(-1)} />
          <ChangePasswordBtn type="submit" value="변경" onClick={handleChangePassword} style={{ backgroundColor: "#fff", color: "#000" }} />
        </ChangePasswordBtnBox>
      </ChangePassBox>
      {loading && <Loading />}
    </ChangeContainer>
  )
}

export default ChangePasswd;

const ChangeContainer = styled.div`
  display: flex;
  width: 99vw;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const ChangePassBox = styled.div`
  width: 90%;
  height: 80%;
`;

const ChangeTitleBox = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
`;

const ChangeTitle = styled.p`
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  margin: 0px;
`;

const ChangePasswordInputBox = styled.div`
  display: flex;
  width: 100%;
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
const ChangePasswordInputTitleBox = styled.div`
  display: flex;
  width: 15%;
  justify-content: left;
`;
const ChangePasswordInputTitle = styled.p`
  font-size: 21px;
  font-weight: bold;
`;
const ChangePasswordInput = styled.input`
  width: 60%;
  height: 33px;
  font-size: 15px;
  padding-left: 15px;
  border-radius: 10px;
  border: 1px solid black;
  outline: none;
`;

const ChangePasswordEmailBox = styled.div`
  display: flex;
  width: 52%;
  height: 33px;
  align-items: center;
  font-size: 15px;
  padding-left: 15px;
  border-radius: 10px;
  border: 1px solid black;
  outline: none;
`;

const ChangePasswordBtnBox = styled.div`
  display: flex;
  width: 100%;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
`;

const ChangePasswordBtn = styled.input`
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