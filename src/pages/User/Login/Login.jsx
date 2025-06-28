import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Loading from '@/components/loading/loading';
import { toast } from 'react-toastify';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      setLoading(false);
      navigate("/");
      toast.success("로그인 되었습니다!");
      window.location.reload();
    } else {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <MainLoginBox>
        <LoginTitle>로그인</LoginTitle>
        <form onSubmit={handleSubmit}>
          <LoginInputBox>
            <LoginInputTitleBox>
              <LoginInputTitle>아이디</LoginInputTitle>
            </LoginInputTitleBox>
            <LoginInput type="text" value={email} placeholder='아이디를 입력해주세요.' onChange={(e) => setEmail(e.target.value)} />
          </LoginInputBox>
          <LoginInputBox>
            <LoginInputTitleBox>
              <LoginInputTitle>비밀번호</LoginInputTitle>
            </LoginInputTitleBox>
            <LoginInput type="password" value={password} placeholder='비밀번호를 입력해주세요.' onChange={(e) => setPassword(e.target.value)} />
          </LoginInputBox>
          <LoginBtnBox>
            <LoginBtn type="button" value="뒤로" onClick={() => navigate(-1)} />
            <LoginBtn type="submit" value="로그인" />
          </LoginBtnBox>
        </form>
        <LoginBottomMainBox>
          <LoginBotBox>
            <LoginBotMenu>
              <p>회원가입은 <span onClick={() => navigate('/signup')}>여기</span>에서 할 수 있습니다.</p>
            </LoginBotMenu>
          </LoginBotBox>
        </LoginBottomMainBox>
      </MainLoginBox>
      {loading && <Loading />}
    </LoginContainer>
  );
}

export default Login;

const LoginContainer = styled.div`
  display: flex;
  width: 99vw;
  min-height: 100vh;
  justify-content: center;
`;
const MainLoginBox = styled.div`
  justify-content: center;
  width: 80%;
  height: 80%;
  margin-top: 120px;
`;
const LoginTitle = styled.h1`
  display: flex;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  margin: 30px 0px;
  color: #538572;
`;
const LoginInputBox = styled.div`
  display: flex;
  height: 90px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;
const LoginInputTitleBox = styled.div`
  display: flex;
  width: 15%;
  justify-content: left;
`;
const LoginInputTitle = styled.p`
  font-size: 23px;
  font-weight: bold;
  color: #538572;
`;
const LoginInput = styled.input`
  width: 60%;
  height: 45px;
  font-size: 18px;
  padding-left: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  transition: border-color 0.2s ease;
  &:focus {
    border-color: #538572;
  }
`;
const LoginBtnBox = styled.div`
  display: flex;
  width: 100%;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
`;
const LoginBtn = styled.input`
  display: flex;
  width: 130px;
  height: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  color: white;
  cursor: pointer;
  margin: 0px 20px;
  background-color: #538572;
  border: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #406a5b;
  }

  &:first-child {
    background-color: white;
    color: #538572;
    border: 2px solid #538572;
  }

  &:first-child:hover {
    background-color: #f5f5f5;
  }
`;
const LoginBotMenu = styled.div`
  display: block;
  margin-top: 20px;
  text-align: center;

  p {
    font-size: 14px;
    margin-top: 10px;

    span {
      font-weight: bold;
      color: #538572;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: #406a5b;
        text-decoration: underline;
      }
    }
  }
`;
const LoginBottomMainBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;
const LoginBotBox = styled.div`
  display: flex;
  width: 35%;
  border-top: 1px solid black;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
`;