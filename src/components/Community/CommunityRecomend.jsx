import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function CommunityCard({ CommunityTitle, Content, Author, CommunityId }) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/community/${CommunityId}`)}>
      <Title>{CommunityTitle}</Title>
      <ContentText>{Content}</ContentText>
      <BottomSection>
        <Divider />
        <AuthorText>{Author}</AuthorText>
      </BottomSection>
    </Card>
  );
}

export default CommunityCard;

const Card = styled.div`
  width: 280px;
  height: 160px;
  background-color: #ffffff;
  border-radius: 18px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  padding: 18px 16px 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid #e1f0e7;

  &:hover {
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-5px);
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #2e5f4d;
  margin-bottom: 6px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ContentText = styled.div`
  font-size: 14px;
  color: #444;
  line-height: 1.5;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Divider = styled.div`
  flex-grow: 1;
  height: 1px;
  background-color: #cfe7db;
  margin-right: 10px;
  border-radius: 999px;
`;

const AuthorText = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #6b8f7e;
  white-space: nowrap;
`;
