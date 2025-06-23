import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Loading from '@/components/loading/loading';

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
      alert("로그인 되었습니다!");
      setLoading(false);
      navigate("/");
    } else {
      alert("로그인 실패: " + result.error);
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
            <LoginBtn type="submit" value="로그인" style={{ backgroundColor: "#fff", color: "#000" }} />
          </LoginBtnBox>
        </form>
        <LoginBottomMainBox>
          <LoginBotBox>
            <LoginBotMenu>
              <p>비밀번호를 잊으셨다면, <span onClick={() => navigate('/changepasswd')}>여기</span>를 눌러주세요.</p>
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
  align-items: center;
`;
const MainLoginBox = styled.div`
  justify-content: center;
  width: 80%;
  height: 80%;
  margin-top: 120px;
`;
const LoginTitle = styled.h1`
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  margin: 30px 0px;
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
`;
const LoginInput = styled.input`
  width: 60%;
  height: 40px;
  font-size: 18px;
  padding-left: 15px;
  border-radius: 10px;
  border: 1px solid black;
  outline: none;
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
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  background-color: black;
  color: white;
  cursor: pointer;
  margin: 0px 20px;
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
const LoginBotMenu = styled.div`
  display: block;
  margin-top: 20px;
  p{
    font-size: 14px;
    margin-top: 10px;
    span{
      font-weight: bold;
      color: #004F94;
      cursor: pointer;
    }
  }
`;