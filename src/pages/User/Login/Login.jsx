import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import Loading from '@/components/loading/loading';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateName = (value) => /^[a-zA-Z]+$/.test(value);

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value === "" || validateName(value)) {
      setName(value);
    } else {
      toast.warning("아이디는 영어 알파벳만 입력 가능합니다.");
    }
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

    if (!password) {
      toast.warning("비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(name, password);
      if (result.success) {
        navigate("/");
        window.location.reload();
      } else {
        const errorMessages = Array.isArray(result.error) ? result.error : [result.error];
        errorMessages.forEach(msg => toast.error(msg));
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      toast.error("로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <MainLoginBox>
        <LoginTitle>로그인</LoginTitle>
        <form onSubmit={handleSubmit}>
          <LoginInputBox>
            <LoginInputTitle>아이디</LoginInputTitle>
            <LoginInput
              type="text"
              value={name}
              placeholder="아이디를 입력해주세요 (4글자 이상)"
              onChange={handleNameChange}
            />
          </LoginInputBox>
          <LoginInputBox>
            <LoginInputTitle>비밀번호</LoginInputTitle>
            <LoginInput
              type="password"
              value={password}
              placeholder="비밀번호를 입력해주세요"
              onChange={(e) => setPassword(e.target.value)}
            />
          </LoginInputBox>
          <LoginBtnBox>
            <LoginBtn type="button" value="뒤로" onClick={() => navigate(-1)} />
            <LoginBtn type="submit" value="로그인" />
          </LoginBtnBox>
        </form>
        <LoginBottomMainBox>
          <LoginBotBox>
            <LoginBotMenu>
              <p>
                회원가입은 <span onClick={() => navigate('/signup')}>여기</span>에서 할 수 있습니다.
              </p>
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
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 20px;
`;

const MainLoginBox = styled.div`
  width: 100%;
  max-width: 1200px;
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 140px;
`;

const LoginTitle = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #538572;
  text-align: center;
  margin-bottom: 32px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const LoginInputBox = styled.div`
  margin-bottom: 24px;
`;

const LoginInputTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #538572;
  margin-bottom: 8px;
`;

const LoginInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #a7c8b7;
  border-radius: 8px;
  outline: none;
  background-color: #f4fdfa;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #538572;
    box-shadow: 0 0 8px rgba(83, 133, 114, 0.4);
  }

  &::placeholder {
    color: #a7c8b7;
  }
`;

const LoginBtnBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 32px;
`;

const LoginBtn = styled.input`
  width: 140px;
  height: 48px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 10px;
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

const LoginBottomMainBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const LoginBotBox = styled.div`
  text-align: center;
  border-radius: 8px;
`;

const LoginBotMenu = styled.div`
  font-size: 16px;
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