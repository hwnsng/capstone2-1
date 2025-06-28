import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useProfile from '@/hooks/useProfile';
import { toast } from 'react-toastify';

function HouseDetail() {
  const { name } = useProfile();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [my, setMy] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [subImageIndex, setSubImageIndex] = useState(0);
  const { id: HouseId } = useParams();
  const navigate = useNavigate();

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editRegion, setEditRegion] = useState('');
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    fetchHouse();
  }, [HouseId]);

  useEffect(() => {
    if (name && house?.authorName) {
      setMy(name === house.authorName);
    }
  }, [name, house]);

  useEffect(() => {
    if (house) {
      setEditTitle(house.title);
      setEditContent(house.content);
      setEditRegion(house.region);
      setEditPrice(house.price);
    }
  }, [house]);

  const fetchHouse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/houses/${HouseId}`
      );
      setHouse(res.data.house);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('집 정보를 불러오는 데 실패했습니다.');
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/houses/${HouseId}`,
        {
          title: editTitle,
          content: editContent,
          region: editRegion,
          price: editPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      toast.success('수정이 완료되었습니다.');
      setEditMode(false);
      fetchHouse();
    } catch (err) {
      console.error(err);
      toast.error('수정에 실패했습니다.');
    }
  };

  const confirmDelete = () => {
    toast.info(
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ marginBottom: '10px' }}>정말로 삭제하시겠습니까?</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await axios.delete(
                  `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/houses/${HouseId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                  }
                );
                toast.success('삭제가 완료되었습니다.');
                navigate('/house');
              } catch (err) {
                console.error(err);
                toast.error('삭제에 실패했습니다.');
              }
            }}
            style={{
              backgroundColor: '#538572',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            확인
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              backgroundColor: '#ccc',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        closeButton: false,
      }
    );
  };

  if (loading) return <Container>로딩 중...</Container>;
  if (!house) return <Container>집 정보를 찾을 수 없습니다.</Container>;

  return (
    <Container>
      {!editMode ? (
        <>
          <MainImage>
            <img src={house.mainImage} alt="메인 이미지" />
            {my && (
              <EditButtonWrap>
                <button onClick={() => setEditMode(true)}>수정</button>
                <button onClick={confirmDelete}>삭제</button>
              </EditButtonWrap>
            )}
          </MainImage>

          <ContentBox>
            <DetailCard>
              <label>제목</label>
              <div style={{ color: 'black' }}>{house.title}</div>
            </DetailCard>
            <DetailCard>
              <label>내용</label>
              <div style={{ color: 'black' }}>{house.content}</div>
            </DetailCard>
            <DetailCard>
              <label>지역</label>
              <div style={{ color: 'black' }}>{house.region}</div>
            </DetailCard>
            <DetailCard>
              <label>가격</label>
              <div style={{ color: 'black' }}>{house.price}</div>
            </DetailCard>
            <DetailCard>
              <label>작성자</label>
              <div style={{ color: 'black' }}>{house.authorName}</div>
            </DetailCard>
          </ContentBox>

          <SubImageSection>
            <img
              src={house.insideImages?.[subImageIndex]}
              alt="서브 이미지"
              className="main"
            />
            <div className="thumbs">
              {house.insideImages?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`서브 ${i}`}
                  className={subImageIndex === i ? 'active' : ''}
                  onClick={() => setSubImageIndex(i)}
                />
              ))}
            </div>
          </SubImageSection>
        </>
      ) : (
        <form onSubmit={handleEditSubmit} style={{ width: '100%', height: '100vh' }}>
          <ContentBox style={{ marginTop: '50px' }}>
            제목
            <StyledInput
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
            내용
            <StyledInput
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="내용을 입력하세요"
            />
            지역
            <StyledSelect
              value={editRegion}
              onChange={(e) => setEditRegion(e.target.value)}
            >
              <option value="다인면">다인면</option>
              <option value="안사면">안사면</option>
              <option value="신평면">신평면</option>
              <option value="안평면">안평면</option>
              <option value="안계면">안계면</option>
              <option value="단북면">단북면</option>
              <option value="단밀면">단밀면</option>
              <option value="구천면">구천면</option>
              <option value="비안면">비안면</option>
              <option value="봉양면">봉양면</option>
              <option value="의성읍">의성읍</option>
              <option value="단촌면">단촌면</option>
              <option value="점곡면">점곡면</option>
              <option value="옥산면">옥산면</option>
              <option value="사곡면">사곡면</option>
              <option value="금성면">금성면</option>
              <option value="가음면">가음면</option>
              <option value="춘산면">춘산면</option>
            </StyledSelect>
            가격
            <StyledInput
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              placeholder="가격을 입력하세요"
            />
            <EditSubmitBtnBox>
              <button type="button" onClick={() => setEditMode(false)} style={{ backgroundColor: "#ffffff", color: "black" }}>취소</button>
              <button type="submit">수정 완료</button>
            </EditSubmitBtnBox>
          </ContentBox>
        </form>
      )}
    </Container>
  );
}

export default HouseDetail;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 140px 20px 60px;
  min-height: 100vh;
`;

const EditButtonWrap = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  button {
    margin-left: 10px;
    background: #538572;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
  }
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 40px;
  color: #538572;
  font-weight: bold;
`;

const DetailCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background: #f9f9f9;
  label {
    font-weight: bold;
    margin-bottom: 10px;
    color: #538572;
  }
`;

const EditSubmitBtnBox = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  margin-top: 16px;
  justify-content: right;
  button {
    padding: 10px 20px;
    border-radius: 30px;
    border: none;
    font-size: 16px;
    cursor: pointer;
    border: 1px solid #538572;
    background-color: #538572;
    color: white;
  }
`;

const MainImage = styled.div`
  position: relative;
  img {
    width: 100%;
    max-height: 600px;
    object-fit: cover;
    border-radius: 12px;
  }
`;

const SubImageSection = styled.div`
  margin-top: 40px;

  img.main {
    width: 60%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 12px;
  }

  .thumbs {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    overflow-x: auto;
    img {
      width: 80px;
      height: 70px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.2s;
    }

    img.active {
      border: 2px solid #3b6350;
      opacity: 1;
      transform: scale(1.05);
    }
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #3b6350;
    box-shadow: 0 0 0 2px rgba(59, 99, 80, 0.2);
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: white;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #3b6350;
    box-shadow: 0 0 0 2px rgba(59, 99, 80, 0.2);
  }
`;