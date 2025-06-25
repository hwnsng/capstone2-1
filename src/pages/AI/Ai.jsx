import styled from 'styled-components';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import Loading from '@/components/loading/loading';

function Ai() {
  const [userChat, setUserChat] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const SetUserChat = (e) => {
    setUserChat(e.target.value);
  };

  const handleInputUser = async (e) => {
    e.preventDefault();
    if (!userChat.trim()) return;

    const userMessage = { type: 'user', text: userChat };
    setChatHistory(prev => [...prev, userMessage]);
    const currentUserChat = userChat;
    setUserChat("");
    setLoading(true);

    try {
      const res = await axios.post(`http://127.0.0.1:8000/query`, {
        query: currentUserChat,
      });
      const aiMessage = { type: 'ai', text: res.data.answer };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AiContainer>
      <AiMainBox>
        <AiChatBox>
          {chatHistory.map((msg, index) => (
            msg.type === 'user' ? (
              <AiChatMe key={index}><p>{msg.text}</p></AiChatMe>
            ) : (
              <AiChat key={index}><p>{msg.text}</p></AiChat>
            )
          ))}
          <div ref={chatEndRef} />
        </AiChatBox>
      </AiMainBox>
      <AiChatInputBox>
        <form onSubmit={handleInputUser}>
          <input
            type="text"
            placeholder="의성에 대해 무엇이든 물어보세요!"
            value={userChat}
            onChange={SetUserChat}
          />
          <button type="submit">↑</button>
        </form>
      </AiChatInputBox>
      {loading && <Loading />}
    </AiContainer>
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
  max-height: 70vh;
`;

const AiChatBox = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  height: 100%;
`;

const AiChatMe = styled.div`
  display: flex;
  justify-content: flex-end;
  p {
    display: flex;
    max-width: 65%;
    background-color: #538572;
    font-size: 18px;
    color: #fff;
    padding: 17px;
    border-radius: 50px;
  }
`;

const AiChat = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 12px;
  margin: 10px 0;
  p {
    max-width: 65%;
    font-size: 18px;
    padding: 17px;
    border-radius: 50px;
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
    border: 1px solid black;
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
      background-color: black;
      color: white;
      border-radius: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
`;
