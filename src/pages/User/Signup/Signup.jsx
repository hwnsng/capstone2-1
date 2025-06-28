import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import Loading from '@/components/loading/loading';

function Signup() {
  const navigate = useNavigate();
  const { signup, SendToEmail, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.length < 4) {
      toast.warning("아이디는 4글자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password, code);
    if (result.success) {
      setLoading(false);
      navigate("/signin");
      toast.success("회원가입 성공하셨습니다!");
    } else {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSendToEmail = async (e) => {
    setLoading(true);
    e.preventDefault();
    const sendEmailResult = await SendToEmail(email);
    if (sendEmailResult.success) {
      toast.success("인증코드 발급 성공");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }
  const handleCodeChange = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, '');
    setCode(onlyNumbers);
  };
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
            <DoubleInputWrapper>
              <SignupInput
                type="email"
                value={email}
                placeholder="이메일을 입력해주세요."
                onChange={(e) => setEmail(e.target.value)}
              />
              <ActionButton type="button" onClick={handleSendToEmail}>인증코드 발급</ActionButton>
              <CodeInput
                type="number"
                value={code}
                placeholder="인증코드"
                onChange={handleCodeChange}
              />
            </DoubleInputWrapper>
          </SignupInputBox>
          <SignupInputBox>
            <SignupInputTitleBox>
              <SignupInputTitle>비밀번호</SignupInputTitle>
            </SignupInputTitleBox>
            <SignupInput type="password" value={password} placeholder='비밀번호를 입력해주세요.' onChange={(e) => setPassword(e.target.value)} />
          </SignupInputBox>
          <SignupBtnBox>
            <SignupBtn type="button" value="뒤로" onClick={() => navigate(-1)} />
            <SignupBtn type="submit" value="가입" />
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
  margin-top: 140px;
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
const SignupInputTitleBox = styled.div`
  display: flex;
  width: 15%;
  justify-content: left;
`;
const SignupInputTitle = styled.p`
  font-size: 21px;
  font-weight: bold;
  color: #538572;
`;
const SignupBtnBox = styled.div`
  display: flex;
  width: 100%;
  margin-top: 27px;
  justify-content: center;
  align-items: center;
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

const SignupTitle = styled.h1`
  display: flex;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  margin: 20px 0;
  color: #538572;
`;
const DoubleInputWrapper = styled.div`
  width: 80%;
  display: flex;
  gap: 10px;
`;
const SignupInput = styled.input`
  flex: 1;
  height: 36px;
  font-size: 15px;
  padding-left: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #538572;
  }
`;

const ActionButton = styled.button`
  height: 36px;
  padding: 0 16px;
  background-color: #538572;
  color: white;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #406a5b;
  }
`;

const SignupBtn = styled.input`
  display: flex;
  width: 120px;
  height: 45px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  cursor: pointer;
  margin: 0px 20px;
  border: none;
  background-color: #538572;
  color: white;
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
    background-color: #f8f8f8;
  }
`;

const CodeInput = styled(SignupInput)`
  flex: none;
  width: 100px;
`;