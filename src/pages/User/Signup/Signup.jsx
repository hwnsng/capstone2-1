import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import Loading from '@/components/loading/loading';

function Signup() {
  const navigate = useNavigate();
  const { signup, SendToEmail } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCodeInputVisible, setIsCodeInputVisible] = useState(false);
  const [timer, setTimer] = useState(300);

  const validateName = (value) => /^[a-zA-Z]+$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value) => ({
    hasUpperCase: /[A-Z]/.test(value),
    hasLowerCase: /[a-z]/.test(value),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    hasNumber: /\d/.test(value),
  });

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateName(value)) {
      setName(value);
    } else {
      toast.warning("아이디는 영어 알파벳만 입력 가능합니다.");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.length < 4) {
      toast.warning("아이디는 4글자 이상이어야 합니다.");
      return;
    }

    if (!validateName(name)) {
      toast.warning("아이디는 영어 알파벳만 입력 가능합니다.");
      return;
    }

    if (!validateEmail(email)) {
      toast.warning("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    const passwordValid = validatePassword(password);
    if (!passwordValid.hasUpperCase || !passwordValid.hasLowerCase || !passwordValid.hasSpecialChar || !passwordValid.hasNumber) {
      toast.warning("비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const result = await signup(email, name, password, code);
      if (result.success) {
        toast.success("회원가입 성공하셨습니다!");
        navigate("/signin");
      }
    } catch (err) {
      const errorMessages = Array.isArray(err.error) ? err.error : [err.error];
      errorMessages.forEach(msg => toast.error(msg));
      console.error("회원가입 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning("이메일을 입력해주세요.");
      return;
    }
    if (!validateEmail(email)) {
      toast.warning("유효한 이메일 주소를 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const sendEmailResult = await SendToEmail(email);
      if (sendEmailResult.success) {
        toast.success("인증코드 발급 성공");
        setIsCodeInputVisible(true);
        setTimer(300);
      } else {
        const errorMessages = Array.isArray(sendEmailResult.error) ? sendEmailResult.error : [sendEmailResult.error];
        errorMessages.forEach(msg => toast.error(msg));
      }
    } catch (err) {
      console.error("인증코드 발급 오류:", err);
      toast.error("인증코드 발급에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const onlyNumbers = e.target.value.replace(/\D/g, '');
    setCode(onlyNumbers);
  };

  useEffect(() => {
    if (isCodeInputVisible && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsCodeInputVisible(false);
      setCode("");
      toast.warning("인증코드 유효 시간이 만료되었습니다. 다시 발급해주세요.");
    }
  }, [isCodeInputVisible, timer]);

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <SignupContainer>
      <MainSignupBox>
        <SignupTitle>회원가입</SignupTitle>
        <form onSubmit={handleSubmit}>
          <SignupInputBox>
            <SignupInputTitle>아이디</SignupInputTitle>
            <SignupInput
              type="text"
              value={name}
              placeholder="아이디를 입력해주세요 (4글자 이상)"
              onChange={handleNameChange}
            />
          </SignupInputBox>
          <SignupInputBox>
            <SignupInputTitle>이메일</SignupInputTitle>
            <DoubleInputWrapper>
              <SignupInput
                type="email"
                value={email}
                placeholder="이메일을 입력해주세요"
                onChange={handleEmailChange}
              />
              <ActionButton type="button" onClick={handleSendToEmail}>
                인증코드 발급
              </ActionButton>
              {isCodeInputVisible && (
                <CodeInputWrapper>
                  <CodeInput
                    type="number"
                    value={code}
                    placeholder="인증코드"
                    onChange={handleCodeChange}
                    disabled={timer === 0}
                  />
                  <Timer>{formatTimer()}</Timer>
                </CodeInputWrapper>
              )}
            </DoubleInputWrapper>
          </SignupInputBox>
          <SignupInputBox>
            <SignupInputTitle>비밀번호</SignupInputTitle>
            <SignupInput
              type="password"
              value={password}
              placeholder="비밀번호를 입력해주세요"
              onChange={handlePasswordChange}
            />
            <PasswordCriteria>
              대문자 1개 이상, 소문자 1개 이상, 숫자 1개 이상, 특수문자 1개 이상 포함
            </PasswordCriteria>
          </SignupInputBox>
          <SignupBtnBox>
            <SignupBtn type="button" value="뒤로" onClick={() => navigate(-1)} />
            <SignupBtn type="submit" value="가입" />
          </SignupBtnBox>
        </form>
        <SignupBottomMainBox>
          <SignupBotBox>
            <SignupBotMenu>
              <p>
                이미 계정이 있으신가요?{' '}
                <span onClick={() => navigate('/signin')}>로그인</span>
              </p>
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
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 20px;
`;

const MainSignupBox = styled.div`
  width: 100%;
  max-width: 1200px;
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 140px;
`;

const SignupTitle = styled.h1`
  font-size: 30px;
  font-weight: bold;
  color: #538572;
  text-align: center;
  margin-bottom: 24px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const SignupInputBox = styled.div`
  margin-bottom: 16px;
`;

const SignupInputTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #538572;
  margin-bottom: 6px;
`;

const DoubleInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
`;

const SignupInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #a7c8b7;
  border-radius: 6px;
  outline: none;
  background-color: #f4fdfa;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #538572;
    box-shadow: 0 0 6px rgba(83, 133, 114, 0.3);
  }

  &::placeholder {
    color: #a7c8b7;
  }
`;

const ActionButton = styled.button`
  width: 160px;
  height: 40px;
  padding: 0 16px;
  background-color: #538572;
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #406a5b;
  }
`;

const CodeInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CodeInput = styled(SignupInput)`
  width: 100%;
  max-width: 150px;
`;

const Timer = styled.span`
  font-size: 12px;
  color: #538572;
  font-family: 'Noto Sans KR', sans-serif;
`;

const PasswordCriteria = styled.p`
  font-size: 12px;
  color: #a7c8b7;
  margin-top: 6px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const SignupBtnBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

const SignupBtn = styled.input`
  width: 120px;
  height: 40px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Noto Sans KR', sans-serif;

  &:first-child {
    background-color: #ffffff;
    color: #538572;
    border: 2px solid #538572;
    &:hover {
      background-color: #e4efe8;
    }
  }

  &:last-child {
    background-color: #538572;
    color: white;
    &:hover {
      background-color: #406a5b;
    }
  }
`;

const SignupBottomMainBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const SignupBotBox = styled.div`
  text-align: center;
`;

const SignupBotMenu = styled.div`
  font-size: 14px;
  color: #666;
  p {
    margin: 0;
    span {
      color: #538572;
      font-weight: 600;
      cursor: pointer;
      transition: color 0.3s ease;
      &:hover {
        color: #406a5b;
      }
    }
  }
`;