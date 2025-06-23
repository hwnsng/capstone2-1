import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loading from '@/components/loading/loading';
import axios from 'axios';

function MentoCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [introduce, setIntroduce] = useState();

  const introducePosts = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/mentors", {
        introduce
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      setIntroduce(response.data.content);
      alert("멘토 등록이 완료되었습니다");
      setLoading(false);
      navigate("/mentolist");
    } catch (err) {
      console.error('게시글 불러오기 실패:', err);
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
          <MentoCreateBtn type="button" value="뒤로" onClick={() => navigate(-1)} />
          <MentoCreateBtn type="submit" value="확인" onClick={introducePosts} style={{ backgroundColor: "#fff", color: "#000" }} />
        </MentoCreateBtnBox>
      </MentoCreateMainBox>
      {loading && <Loading />}
    </MentoCreateContainer>
  )
}

export default MentoCreate;

const MentoCreateContainer = styled.div`
  display: flex;
  width: 99vw;
  min-height 100vh;
  justify-content: center;
`;

const MentoCreateMainBox = styled.div`
  width: 90%;
  margin-top: 120px;
`;

const MentoCreateMainTitleBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  h1{
    font-size: 25px;
    font-weight: bold;
  }
`;

const MentoCreateBtnBox = styled.div`
  display: flex;
  width: 100%;
  margin-top: 38px;
  margin-bottom: 40px;
  justify-content: end;
  align-items: center;
`;

const MentoCreateBtn = styled.input`
  display: flex;
  width: 130px;
  height: 50px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  font-size: 23px;
  background-color: black;
  color: white;
  cursor: pointer;
  margin: 0px 20px;
`;

const MentoCreateInfoInput = styled.textarea`
  width: 100%;
  height: 400px;
  margin-top: 30px;
  font-size: 20px;
  padding: 20px;
  border: 1px solid black;
`;