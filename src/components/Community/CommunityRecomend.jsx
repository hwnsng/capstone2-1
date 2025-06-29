import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function HouseRecomend({ CommunityTitle, Content, Author, CommunityId }) {
  const navigate = useNavigate();

  return (
    <CommunityMenuContainer onClick={() => navigate(`/community/${CommunityId}`)}>
      <CommunityMenuInfoBox >
        <CommunityMenuInfoTitle>
          <h1>제목 : {CommunityTitle}</h1>
        </CommunityMenuInfoTitle>
        <CommunityMenuContent>
          <h1>내용 : {Content}</h1>
        </CommunityMenuContent>
        <CommunityMenuUser>
          <h1>작성자 - {Author}</h1>
        </CommunityMenuUser>
      </CommunityMenuInfoBox>
    </CommunityMenuContainer>
  )
}

export default HouseRecomend;

const CommunityMenuContainer = styled.div`
  width: 23%;
  height: 110px;
  border-radius: 15px;
  border: 1px solid black;
  cursor: pointer;
`;

const CommunityMenuInfoBox = styled.div`
  width: 100%;
  height: 40%;
  padding: 0px 13px 0px 13px;
  padding-top: 17px;
`;

const CommunityMenuInfoTitle = styled.div`
  display: flex;
  width: 100%;
  h1 {
    font-size: 15px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const CommunityMenuUser = styled.div`
  display: flex;
  width: 100%;
  margin-top: 11px;
  h1 {
    font-size: 11px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const CommunityMenuContent = styled.div`
  display: flex;
  width: 100%;
  margin-top: 11px;
  h1 {
    font-size: 13px;
    color: #5C5A5A;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
