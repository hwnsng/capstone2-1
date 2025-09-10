import styled from 'styled-components';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Loading from '@/components/loading/loading';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>오류가 발생했습니다.</h2>
          <p>{this.state.error?.message || '알 수 없는 오류'}</p>
          <button onClick={() => window.location.reload()}>새로고침</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Ai() {
  const [userChat, setUserChat] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [aiTypingText, setAiTypingText] = useState('');
  const [showTyping, setShowTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const sessionIdRef = useRef(null);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      sessionIdRef.current = storedSessionId;
      fetchHistory();
    }
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) return;

      sessionIdRef.current = sessionId;

      // const res = await axios.get(`http://127.0.0.1:8000/history`);
      // const conversations = res.data.conversations || [];

      // const formattedHistory = conversations.flatMap((item) => [
      //   { type: 'user', text: item.user_input },
      //   { type: 'ai', text: item.bot_response?.source_summary || '답변이 없습니다.' },
      // ]);

      // setChatHistory(formattedHistory);

      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (err) {
      console.error('fetchHistory 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, aiTypingText]);

  const handleInputUser = async e => {
    e.preventDefault();
    if (!userChat.trim()) return;

    const currentUserChat = userChat;
    setUserChat('');
    setChatHistory(prev => [...prev, { type: 'user', text: currentUserChat }]);
    setAiTypingText('');
    setShowTyping(true);

    try {
      const postData = { question: currentUserChat };
      if (sessionIdRef.current) postData.sessionId = sessionIdRef.current;

      const res = await axios.post(
        'https://port-0-aiaiai-mcpslki2ccb5c8fd.sel5.cloudtype.app/query',
        postData
      );
      const fullText = res.data.answer || '답변이 없습니다.';

      if (!sessionIdRef.current && res.data.session_id) {
        sessionIdRef.current = res.data.session_id;
        localStorage.setItem('sessionId', res.data.session_id);
      }

      typeTextEffect(fullText);
    } catch (err) {
      console.error('handleInputUser 오류:', err);
      typeTextEffect(
        '현재 AI 서버가 정상 동작하지 않습니다.\n잠시 후 다시 시도 해 주세요.'
      );
    }
  };

  const typeTextEffect = text => {
    let index = 0;
    setAiTypingText('');
    setShowTyping(true);
    const typingInterval = setInterval(() => {
      setAiTypingText(prev => {
        const nextChar = text.charAt(index);
        index++;
        if (index >= text.length) {
          clearInterval(typingInterval);
          setChatHistory(prev => [...prev, { type: 'ai', text }]);
          setAiTypingText('');
          setShowTyping(false);
        }
        return prev + nextChar;
      });
    }, 20);
  };

  const handleInputChange = e => setUserChat(e.target.value);

  return (
    <ErrorBoundary>
      <AiContainer>
        <AiMainBox>
          <AiChatBox>
            {chatHistory.length === 0 && !loading && (
              <AiIntro>
                <p>의성에 대해 궁금한 점을 질문하세요!</p>
              </AiIntro>
            )}
            {chatHistory.map((msg, i) =>
              msg.type === 'user' ? (
                <AiChatMe key={i}>
                  <div className="bubble">{msg.text}</div>
                </AiChatMe>
              ) : (
                <AiChat key={i}>
                  <span className="plain">{msg.text}</span>
                </AiChat>
              )
            )}
            {showTyping && !aiTypingText && (
              <AiChat>
                <LoadingDots>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </LoadingDots>
              </AiChat>
            )}
            {aiTypingText && (
              <AiChat>
                <span className="plain">{aiTypingText}</span>
              </AiChat>
            )}
            <div ref={chatEndRef} />
          </AiChatBox>
        </AiMainBox>
        <AiChatInputBox>
          <form onSubmit={handleInputUser}>
            <input
              type="text"
              placeholder="의성에 대해 무엇이든 물어보세요!"
              value={userChat}
              onChange={handleInputChange}
            />
            <button type="submit">↑</button>
          </form>
        </AiChatInputBox>
        {loading && <Loading />}
      </AiContainer>
    </ErrorBoundary>
  );
}

export default Ai;

const AiContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 99vw;
  min-height: 100vh;
  align-items: center;
  padding-bottom: 140px;
`;

const AiMainBox = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 130px;
  display: flex;
  flex-direction: column;
`;

const AiChatBox = styled.div`
  width: 100%;
  padding: 20px;
`;

const AiChatMe = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 12px;
  margin: 10px 0;

  .bubble {
    max-width: 65%;
    background-color: #538572;
    color: white;
    font-size: 16px;
    padding: 15px 18px;
    border-radius: 20px 20px 0 20px;
    white-space: pre-wrap;
    line-height: 1.5;
  }
`;

const AiChat = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 12px;
  margin: 10px 0;

  .plain {
    font-size: 16px;
    white-space: pre-wrap;
    line-height: 1.5;
    color: black;
  }
`;

const AiChatInputBox = styled.div`
  position: fixed;
  bottom: 50px;
  left: 0;
  width: 100vw;
  display: flex;
  justify-content: center;
  z-index: 1000;

  form {
    display: flex;
    width: 900px;
    align-items: center;
    border: 1px solid #538572;
    background-color: white;
    border-radius: 50px;
    background: white;
    padding: 5px 10px;

    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 18px;
      border-radius: 50px;
      padding: 10px;
    }

    button {
      width: 40px;
      height: 40px;
      font-size: 20px;
      background-color: #538572;
      border: 1px solid #538572;
      color: white;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 5px;
  font-size: 30px;
  padding-left: 10px;
  span {
    animation: bounce 1.2s infinite ease-in-out;
  }
  span:nth-child(2) {
    animation-delay: 0.2s;
  }
  span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce {
    0%,
    80%,
    100% {
      transform: scale(1);
    }
    40% {
      transform: scale(1.5);
    }
  }
`;

const AiIntro = styled.div`
  text-align: center;
  font-size: 35px;
  margin: 60px 0;
  line-height: 1.8;
  color: #538572;
  p {
    margin: 0;
  }
`;
