import styled from 'styled-components';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useProfile from '@/hooks/useProfile';
import Loading from '@/components/loading/loading';
import { toast } from 'react-toastify';

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
      toast.success("인증코드 발급 성공");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("로그인이 필요합니다. 다시 로그인해주세요.");
        navigate("/login");
      } else {
        toast.error("인증코드 요청 중 오류가 발생했습니다.");
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
      toast.success("비밀번호 변경을 성공했습니다.");
      navigate("/profile");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("로그인이 필요합니다. 다시 로그인해주세요.");
        navigate("/login");
      } else if (err.response?.data.message === "인증코드 불일치") {
        toast.error("인증코드가 잘못 되었습니다.");
      } else {
        const msg = err.response?.data?.message?.join('\n') ?? "비밀번호 변경 중 오류가 발생했습니다.";
        toast.error(msg);
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
            <ChangePasswordInputTitle>새 비밀번호</ChangePasswordInputTitle>
          </ChangePasswordInputTitleBox>
          <ChangePasswordInput type="password" value={newPassword} placeholder='변경할 비밀번호를 입력해주세요.' onChange={(e) => setNewPassword(e.target.value)} />
        </ChangePasswordInputBox>
        <ChangePasswordBtnBox>
          <ChangePasswordBack type="button" value="뒤로" onClick={() => navigate(-1)} />
          <ChangePasswordBtn type="submit" value="변경" onClick={handleChangePassword} />
        </ChangePasswordBtnBox>
      </ChangePassBox>
      {loading && <Loading />}
    </ChangeContainer>
  )
}

export default ChangePasswd;

const ChangeContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
`;

const ChangePassBox = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 150px;
  padding: 0 20px;
`;

const ChangeTitleBox = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const ChangeTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #538572;
  margin: 0;
`;

const ChangePasswordInputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  padding: 16px 0;
  margin-top: 24px;

  button {
    flex-shrink: 0;
    width: 100px;
    height: 34px;
    border-radius: 30px;
    font-size: 16px;
    background-color: white;
    border: 1px solid #ccc;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #538572;
      color: #538572;
    }
  }
`;

const ChangePasswordInputTitleBox = styled.div`
  width: 15%;
`;

const ChangePasswordInputTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const ChangePasswordInput = styled.input`
  flex: 1;
  height: 36px;
  font-size: 16px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
`;

const ChangePasswordEmailBox = styled.div`
  flex: 1;
  height: 36px;
  font-size: 16px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const ChangePasswordBtnBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  gap: 20px;
`;

const ChangePasswordBack = styled.input`
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

const ChangePasswordBtn = styled.input`
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