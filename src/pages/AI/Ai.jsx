import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import Loading from '@/components/loading/loading';

function Ai() {
  const [userChat, setUserChat] = useState("");
  const [userChating, setUserChating] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiAns, setAiAns] = useState("");
  const [myChatReq, setMyChatReq] = useState(false);

  const SetUserChat = (e) => {
    setUserChat(e.target.value);
  }
  const handleInputUser = async (e) => {
    e.preventDefault();
    if (!userChat.trim()) return;
    setMyChatReq(true);
    setUserChating(userChat);
    setUserChat("");
    setLoading(true);
    try {
      const res = await axios.post(`http://127.0.0.1:8000/query`, {
        query: userChating,
      });
      setAiAns(res.data.answer);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AiContainer>
      <AiMainBox>
        <AiMainTitleBox><h1>AI 상담</h1></AiMainTitleBox>
        <AiChatBox>
          {myChatReq && <AiChatMe><p>{userChating}</p></AiChatMe>}
          <AiChat><p>{aiAns}</p></AiChat>
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
  )
}

export default Ai;

const AiContainer = styled.div`
  display: flex;
  width: 99vw;
  justify-content: center;
`;

const AiMainBox = styled.div`
  width: 90%;
  margin-top: 130px;
`;

const AiMainTitleBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-itmes: center;
  h1{
    font-size: 40px;
    font-weight: bold;
  }
`;

const AiChatBox = styled.div`
  width: 100%;
  p{
    font-size: 20px;
  }
`;

const AiChatMe = styled.div`
  display: flex;
  width: 100%;
  justify-content: right;
  align-items: center;
  padding: 12px;
  font-size: 20px;
  margin: 20px 0;
  p{
    diaplay: flex;
    max-width: 65%;
    background-color: #E9E9E9;
    font-size: 18px;
    padding: 17px;
    justify-content: center;
    align-items: center;
    border-radius: 50px;
  }
`;

const AiChat = styled.div`
  display: flex;
  font-size: 20px;
  justify-content: center;
  p{
    max-width: 65%;
  }
`;

const AiChatInputBox = styled.div`
  display: flex;
  position: fixed;
  width: 100vw;
  height: 50px;
  z-index: 1000;
  justify-content: center;
  margin-top: 630px;
  form{
    display: flex;
    width: 900px;
    align-items: center;
    border-radius: 50px;
    border: 1px solid black;
    input{
      width: 95%;
      padding-left: 17px;
      border: none;
      outline: none;
      font-size: 18px;
      border-radius: 50px;
    }
    button{
      display: flex;
      font-size: 20px;
      height: 40px;
      font-weight: bold;
      width: 40px;
      background-color: black;
      color: white;
      padding: 10px;
      justify-content: center;
      align-items: center;
      border-radius: 50px;
      cursor: pointer;
    }
  }
`;