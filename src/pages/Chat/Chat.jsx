import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Loading from '@/components/loading/loading';
import { toast } from 'react-toastify';

function Chat() {
  const chatContentRef = useRef(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [chatUserId, setChatUserId] = useState(null);
  const [chatUserName, setChatUserName] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [myUserId, setMyUserId] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const socketRef = useRef(null);

  const handleChatChange = (e) => setChatInput(e.target.value);

  const scrollToBottom = () => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTo({
        top: chatContentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatUserId || !socketRef.current) return;

    socketRef.current.emit('sendChat', chatInput);
    setMessages((prev) => [...prev, { sender: 'me', message: chatInput }]);
    setChatInput('');

    setTimeout(() => {
      if (chatContentRef.current) {
        chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
      }
    }, 0);
  };

  const getChating = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error("로그인이 필요합니다");
        return;
      }

      const res = await axios.get(
        `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/chats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!Array.isArray(res.data)) return;

      if (res.data.length === 0) {
        setChatList([]);
        return;
      }

      setChatList(res.data);
      setChatUserId(res.data[0].chat_id);
      setChatUserName(res.data[0].chat_partner || '알 수 없는 사용자');

      let userId = localStorage.getItem('userId');
      if (!userId) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.userId;
        localStorage.setItem('userId', userId);
      }

      setMyUserId(userId);
      setIsDataLoaded(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getChating();
  }, []);

  useEffect(() => {
    if (isAutoScroll && chatContentRef.current) {
      const el = chatContentRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isDataLoaded || !chatUserId || !myUserId || !localStorage.getItem('accessToken')) return;

    setLoading(true);

    const socket = io("https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/capstone", {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinChatRoom', chatUserId);
    });

    socket.on('initChat', (messages) => {
      const parsedMessages = messages.map((msg) => ({
        sender: String(msg.user_id) === String(myUserId) ? 'me' : 'you',
        message: msg.message,
      }));
      setMessages(parsedMessages);

      setTimeout(() => {
        scrollToBottom();
      }, 50);

      setLoading(false);
    });

    socket.on('newChat', (data) => {
      if (String(data.user_id) === String(myUserId)) return;

      setMessages((prev) => [...prev, { sender: 'you', message: data.message }]);

      setTimeout(() => {
        scrollToBottom();
      }, 50);
    });

    socket.on('error_custom', (data) => {
      toast.error(data.message);
    });

    socket.on('connect_error', (error) => {
      console.error(error);
    });

    socket.on('disconnect', () => {
      console.log('연결 종료');
    });

    return () => {
      socket.disconnect();
    };
  }, [isDataLoaded, chatUserId, myUserId]);

  return (
    <ChatContainer>
      <ChatSelectBox>
        {chatList.map((chat) => (
          <div
            key={chat.chat_id}
            className={chat.chat_id === chatUserId ? 'active' : ''}
            onClick={() => {
              if (chat.chat_id !== chatUserId) {
                setChatUserId(chat.chat_id);
                setChatUserName(chat.chat_partner || '알 수 없는 사용자');
                setMessages([]);
              }
            }}
          >
            {chat.chat_partner || '알 수 없는 사용자'}
          </div>
        ))}
      </ChatSelectBox>

      <ChatMainBox>
        <ChatUserNameBox>
          <h1>{chatUserName}</h1>
        </ChatUserNameBox>

        <ChatContentBox
          ref={chatContentRef}
          onScroll={() => {
            const el = chatContentRef.current;
            const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
            setIsAutoScroll(isAtBottom);
          }}
        >
          {messages.map((msg, idx) =>
            msg.sender === 'me' ? (
              <ChatMeBox key={idx}>
                <div>{msg.message}</div>
              </ChatMeBox>
            ) : (
              <ChatYouBox key={idx}>
                <div>{msg.message}</div>
              </ChatYouBox>
            )
          )}
        </ChatContentBox>

        <ChatDivider />
        <ChatInputBox>
          <form onSubmit={handleChatSubmit}>
            <input
              type='text'
              placeholder='메시지를 입력하세요...'
              value={chatInput}
              onChange={handleChatChange}
            />
            <button type='submit'>↑</button>
          </form>
        </ChatInputBox>
      </ChatMainBox>

      {loading && <Loading />}
    </ChatContainer>
  );
}

export default Chat;

const ChatContainer = styled.div`
  display: flex;
  width: 99vw;
  max-width: 1200px;
  height: 100vh;
  padding-top: 89px;
  justify-content: center;
  margin: 0 auto;
`;

const ChatSelectBox = styled.div`
  width: 30%;
  height: 100%;
  background-color: #fff;
  border-right: 2px solid black;
  border-left: 2px solid black;
  div {
    cursor: pointer;
    display: flex;
    width: 100%;
    height: 60px;
    font-size: 20px;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    &.active {
      background-color:rgb(238, 250, 246);
      color: #538572;
    }
  }
`;

const ChatUserNameBox = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  padding-left: 30px;
  border-bottom: 2px solid black;
  align-items: center;
  margin-bottom: 30px;
  h1 {
    font-size: 25px;
    font-weight: bold;
    color: #538572;
  }
`;

const ChatMeBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  margin-bottom: 5px;
  div {
    background-color: #538572;;
    padding: 10px 20px;
    color: white;
    border-radius: 50px;
    margin-right: 50px;
  }
`;

const ChatYouBox = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 5px;
  div {
    background-color: #e8e8e8;
    padding: 10px 20px;
    border-radius: 50px;
    margin-left: 50px;
  }
`;


const ChatMainBox = styled.div`
  width: 95%;
  height: 100%;
  position: relative;
`;

const ChatContentBox = styled.div`
  height: calc(100% - 110px);
  overflow-y: auto;
  padding-bottom: 80px;
`;

const ChatDivider = styled.div`
  height: 1px;
  background-color: #ddd;
  width: 100%;
  position: absolute;
  bottom: 60px;
`;

const ChatInputBox = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  position: absolute;
  bottom: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-top: 1px solid #ccc;

  form {
    display: flex;
    width: 90%;
    height: 45px;
    border: 1px solid #aaa;
    border-radius: 30px;
    overflow: hidden;

    input {
      width: 100%;
      padding-left: 20px;
      font-size: 17px;
      border: none;
      outline: none;
    }

    button {
      display: flex;
      font-size: 20px;
      height: 35px;
      width: 40px;
      font-weight: bold;
      background-color: #538572;
      color: white;
      justify-content: center;
      align-items: center;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      margin: auto 10px;
    }
  }
`;