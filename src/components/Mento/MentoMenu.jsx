import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function MentoMenu({ userProfile, MentoName, introduce, onClick }) {
  const navigate = useNavigate();
  return (
    <MentoMenuContainer onClick={onClick ?? (() => navigate('/mentodetail'))}>
      <MentoMenuImgBox>
        <img src={userProfile} alt="프로필 사진" />
      </MentoMenuImgBox>
      <MentoMenuUserNameBox>
        <h1>{MentoName}</h1>
      </MentoMenuUserNameBox>
      <MentoMenuUserIntroBox>
        <p>{introduce}</p>
      </MentoMenuUserIntroBox>
    </MentoMenuContainer>
  );
}

export default MentoMenu;

const MentoMenuContainer = styled.div`
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  overflow: hidden;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  }
`;

const MentoMenuImgBox = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;

  img {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #538572;
    background-color: white;
  }
`;

const MentoMenuUserNameBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;

  h1 {
    font-size: 18px;
    font-weight: bold;
    color: #538572;
  }
`;

const MentoMenuUserIntroBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16px 16px 16px;

  p {
    font-size: 14px;
    color: #666;
    text-align: center;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;