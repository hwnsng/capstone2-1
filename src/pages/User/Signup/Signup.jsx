import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuth from '@/hooks/useAuth';
import Loading from '@/components/loading/loading';

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { SendToEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const result = await signup(email, name, password, code);
    if (result.success) {
      alert("회원가입 성공하셨습니다!");
      setLoading(false);
      navigate("/signin");
    } else {
      alert("회원가입 실패: " + result.error);
      setLoading(false);
    }
  };

  const handleSendToEmail = async (e) => {
    setLoading(true);
    e.preventDefault();
    const sendEmailResult = await SendToEmail(email);
    if (sendEmailResult.success) {
      alert("인증코드 발급 성공");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }
  return (
    <SignupContainer>
      <MainSignupBox>
        <SignupTitle>회원가입</SignupTitle>
        <form onSubmit={handleSubmit}>
          <SignupInputBox>
            <SignupInputTitleBox>
              <SignupInputTitle>아이디</SignupInputTitle>
            </SignupInputTitleBox>
            <SignupInput type="text" value={name} placeholder='아이디를 입력해주세요.' onChange={(e) => setName(e.target.value)} />
          </SignupInputBox>
          <SignupInputBox>
            <SignupInputTitleBox>
              <SignupInputTitle>이메일</SignupInputTitle>
            </SignupInputTitleBox>
            <EmailInputWrapper>
              <SignupInput
                type="email"
                value={email}
                placeholder='이메일을 입력해주세요.'
                onChange={(e) => setEmail(e.target.value)}
              />
              <AuthButton type="button" onClick={handleSendToEmail}>인증</AuthButton>
            </EmailInputWrapper>
          </SignupInputBox>
          <SignupInputBox>
            <SignupInputTitleBox>
              <SignupInputTitle>인증코드</SignupInputTitle>
            </SignupInputTitleBox>
            <SignupInput type="number" value={code} placeholder='인증코드를 입력해주세요.' onChange={(e) => setCode(e.target.value)} />
          </SignupInputBox>
          <SignupInputBox>
            <SignupInputTitleBox>
              <SignupInputTitle>비밀번호</SignupInputTitle>
            </SignupInputTitleBox>
            <SignupInput type="password" value={password} placeholder='비밀번호를 입력해주세요.' onChange={(e) => setPassword(e.target.value)} />
          </SignupInputBox>
          <SignupBtnBox>
            <SignupBtn type="button" value="뒤로" onClick={() => navigate(-1)} />
            <SignupBtn type="submit" value="가입" style={{ backgroundColor: "#fff", color: "#000" }} />
          </SignupBtnBox>
        </form>
        <SignupBottomMainBox>
          <SignupBotBox>
            <SignupBotMenu>
              <p>계정이 이미 있으시다면 <span onClick={() => navigate('/signin')}>여기</span>를 눌러주세요.</p>
            </SignupBotMenu>
          </SignupBotBox>
        </SignupBottomMainBox>
      </MainSignupBox>
      {loading && <Loading />}
    </SignupContainer>
  );
}

export default Signup;

const SignupContainer = styled.div`
  display: flex;
  width: 99vw;
  min-height: 100vh;
  justify-content: center;
`;
const MainSignupBox = styled.div`
  width: 80%;
  height: 80%;
  margin-top: 100px;
`;
const SignupTitle = styled.h1`
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  margin: 20px 0px;
`;
const SignupInputBox = styled.div`
  display: flex;
  height: 70px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  align-items: center;
  margin-top: 27px;
  width: 100%;
  justify-content: flex-start;
  padding-left: 100px;
`;

const EmailInputWrapper = styled.div`
  width: 80%;
  display: flex;
  gap: 10px;
`;

const SignupInput = styled.input`
  flex-grow: 1;
  height: 33px;
  font-size: 15px;
  padding-left: 15px;
  border-radius: 10px;
  border: 1px solid black;
  outline: none;
`;

const AuthButton = styled.button`
  width: 100px;
  height: 33px;
  background-color: white;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  border: 1px solid black;
`;
const SignupInputTitleBox = styled.div`
  display: flex;
  width: 15%;
  justify-content: left;
`;
const SignupInputTitle = styled.p`
  font-size: 21px;
  font-weight: bold;
`;
const SignupBtnBox = styled.div`
  display: flex;
  width: 100%;
  margin-top: 27px;
  justify-content: center;
  align-items: center;
`;
const SignupBtn = styled.input`
  display: flex;
  width: 120px;
  height: 45px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  background-color: black;
  color: white;
  cursor: pointer;
  margin: 0px 20px;
`;
const SignupBottomMainBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;
const SignupBotBox = styled.div`
  display: flex;
  width: 35%;
  border-top: 1px solid black;
  margin-top: 27px;
  justify-content: center;
  align-items: center;
`;
const SignupBotMenu = styled.div`
  display: block;
  margin-top: 20px;
  p{
    font-size: 14px;
    span{
      font-weight: bold;
      color: #004F94;
      cursor: pointer;
    }
  }
`;