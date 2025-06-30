import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Loading from '@/components/loading/loading';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

function Chat() {
  const navigate = useNavigate();
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

  const handleLeaveChat = async () => {
    const confirmLeave = window.confirm("정말 이 채팅방을 나가시겠습니까?");
    if (!confirmLeave) return;

    setLoading(true);
    try {
      await axios.delete(`https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/chats/${chatUserId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      navigate('/mentolist');
      toast.success("채팅방을 나갔습니다.");
    } catch (err) {
      console.error(err);
      toast.error("채팅방 나가기를 실패했습니다.");
    }
  };

  const getChating = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('로그인이 필요합니다');
        return;
      }

      const res = await axios.get(
        'https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/chats',
        { headers: { Authorization: `Bearer ${token}` } }
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

    const socket = io('https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/capstone', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
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
      setTimeout(() => scrollToBottom(), 50);
      setLoading(false);
    });

    socket.on('newChat', (data) => {
      if (String(data.user_id) === String(myUserId)) return;
      setMessages((prev) => [...prev, { sender: 'you', message: data.message }]);
      setTimeout(() => scrollToBottom(), 50);
    });

    socket.on('error_custom', (data) => toast.error(data.message));
    socket.on('connect_error', (error) => console.error(error));
    socket.on('disconnect', () => console.log('연결 종료'));

    return () => socket.disconnect();
  }, [isDataLoaded, chatUserId, myUserId]);

  return (
    <PageWrapper>
      <ChatWrapper>
        <Sidebar>
          <SidebarHeader>채팅 목록</SidebarHeader>
          <ChatList>
            {chatList.map((chat) => (
              <ChatListItem
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
              </ChatListItem>
            ))}
          </ChatList>
        </Sidebar>

        <ChatSection>
          <ChatHeader>
            <h2>{chatUserName}</h2>
            <LeaveButton onClick={handleLeaveChat}>채팅방 나가기</LeaveButton>
          </ChatHeader>

          <ChatMessages ref={chatContentRef} onScroll={() => {
            const el = chatContentRef.current;
            setIsAutoScroll(el.scrollHeight - el.scrollTop === el.clientHeight);
          }}>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} className={msg.sender}>
                {msg.message}
              </MessageBubble>
            ))}
          </ChatMessages>

          <ChatInputForm onSubmit={handleChatSubmit}>
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
              value={chatInput}
              onChange={handleChatChange}
            />
            <button type="submit">↑</button>
          </ChatInputForm>
        </ChatSection>
      </ChatWrapper>

      {loading && <Loading />}
    </PageWrapper>
  );
}

export default Chat;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 89px);
  padding-top: 89px;
  min-height: 100vh;
`;

const ChatWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1000px;
  height: 80vh;
  background-color: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const Sidebar = styled.div`
  width: 30%;
  border-right: 1px solid #ccc;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #ddd;
  background-color: #f3f3f3;
`;

const ChatList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const ChatListItem = styled.div`
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  &.active {
    background-color: #dfeeee;
    color: #333;
    font-weight: bold;
  }
  &:hover {
    background-color: #ececec;
  }
`;

const ChatSection = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #ccc;
  background-color: #f8f8f8;
  h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
  }
`;

const LeaveButton = styled.button`
  background-color: #d95151;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
  &:hover {
    background-color: #b43d3d;
  }
`;

const ChatMessages = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #fafafa;
`;

const MessageBubble = styled.div`
  display: block;
  padding: 10px 14px;
  margin: 10px 0;
  border-radius: 18px;
  background-color: #eee;
  color: #333;
  max-width: 60%;
  width: fit-content;
  word-wrap: break-word;
  white-space: pre-wrap;

  &.me {
    margin-left: auto;
    background-color: #538572;
    color: white;
  }
`;

const ChatInputForm = styled.form`
  display: flex;
  padding: 16px;
  border-top: 1px solid #ccc;
  background-color: #fff;
  input {
    flex-grow: 1;
    padding: 12px 16px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-right: 10px;
    outline: none;
  }
  button {
    background-color: #538572;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
    &:hover {
      background-color: #3e6d5f;
    }
  }
`;