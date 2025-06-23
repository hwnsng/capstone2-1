import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function MentoMenu({ userProfile, MentoName, onClick }) {
  const navigate = useNavigate();
  const userProfileUrl = `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/static/profile/${userProfile}`;
  return (
    <MentoMenuContainer onClick={onClick ?? (() => navigate('/mentodetail'))}>
      <MentoMenuImgBox>
        <img src={userProfileUrl} alt="프로필 사진" />
      </MentoMenuImgBox>
      <MentoMenuUserNameBox>
        <h1>{MentoName}</h1>
      </MentoMenuUserNameBox>
    </MentoMenuContainer>
  );
}

export default MentoMenu;

const MentoMenuContainer = styled.div`
  width: 250px;
  height: 320px;
  justify-content: center;
  border: 1px solid black;
  cursor: pointer;
`;

const MentoMenuImgBox = styled.div`
  display: flex;
  width: 100%;
  height: 80%;
  justify-content: center;
  align-items: center;
  img{
    width: 90%;
    height: 95%;
    border-radius: 150px;
  }
`;

const MentoMenuUserNameBox = styled.div`
  display: flex;
  width: 100%;
  height: 20%;
  justify-content: center;
  align-items: center;
  h1{
    font-size: 23px;
    font-weight: bold;
  }
`;