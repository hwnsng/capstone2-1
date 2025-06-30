import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loading from '@/components/loading/loading';
import axios from 'axios';
import { toast } from 'react-toastify';

function MentoCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [introduce, setIntroduce] = useState();

  const introducePosts = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/mentors", {
        introduce
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      setIntroduce(res.data.content);
      if (res.data.statusCode === 400) {
        toast.error("이미 등록된 멘토입니다.");
      } else if (!localStorage.getItem("accessToken")) {
        toast.error("로그인이 필요한 서비스입니다.");
      } else {
        toast.success("멘토 등록이 완료되었습니다");
        navigate("/mentolist");
      }
    } catch (err) {
      if (err.status === 400) {
        toast.error("이미 등록된 멘토입니다.");
      } else if (!localStorage.getItem("accessToken")) {
        toast.error("로그인이 필요한 서비스입니다.");
      } else {
        toast.success("멘토 등록이 완료되었습니다");
        navigate("/mentolist");
      }
      console.error('게시글 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MentoCreateContainer>
      <MentoCreateMainBox>
        <MentoCreateMainTitleBox>
          <h1>자기소개</h1>
        </MentoCreateMainTitleBox>
        <MentoCreateInfoInput
          name="content"
          placeholder="소개를 입력해주세요"
          value={introduce}
          onChange={(e) => setIntroduce(e.target.value)}
        />
        <MentoCreateBtnBox>
          <MentoCreBtn type="button" value="뒤로" onClick={() => navigate(-1)} />
          <MentoDelBtn type="submit" value="확인" onClick={introducePosts} />
        </MentoCreateBtnBox>
      </MentoCreateMainBox>
      {loading && <Loading />}
    </MentoCreateContainer>
  )
}

export default MentoCreate;

const MentoCreateContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 120px 20px 60px;
  min-height: 100vh;
`;

const MentoCreateMainBox = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 40px;
`;

const MentoCreateMainTitleBox = styled.div`
  h1 {
    font-size: 28px;
    font-weight: bold;
    color: #538572;
    margin-bottom: 20px;
  }
`;

const MentoCreateInfoInput = styled.textarea`
  width: 100%;
  height: 300px;
  font-size: 18px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #a7c8b7;
  resize: none;
  background: #fff;
  outline: none;
  transition: box-shadow 0.2s;
  &:focus {
    border-color: #538572;
    box-shadow: 0 0 0 3px rgba(59, 99, 80, 0.2);
  }
`;

const MentoCreateBtnBox = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
`;

const ButtonBase = styled.input`
  width: 120px;
  height: 48px;
  font-size: 18px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
`;

const MentoCreBtn = styled(ButtonBase)`
  background-color: white;
  border-color: #538572;
  color: #538572;
  &:hover {
    background-color: #e6f3ec;
  }
`;

const MentoDelBtn = styled(ButtonBase)`
  background-color: #538572;
  border-color: #538572;
  color: white;
  &:hover {
    background-color: #2c4f3f;
  }
`;