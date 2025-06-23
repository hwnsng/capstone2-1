import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useProfile from '@/hooks/useProfile';

function HouseDetail() {
  const { name } = useProfile();
  const [subHouse, setSubHouse] = useState(0);
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [my, setMy] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { id: HouseId } = useParams();
  const navigate = useNavigate();
  const [editTitle, setEditTitle] = useState();
  const [editContent, setEditContent] = useState();
  const [editRegion, setEditRegion] = useState();
  const [editPrice, setEditPrice] = useState();

  useEffect(() => {
    if (name && house?.authorName) {
      setMy(name === house.authorName);
    }
  }, [name, house]);

  useEffect(() => {
    fetchHouse();
  }, [HouseId]);

  const fetchHouse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/houses/${HouseId}`
      );
      setHouse(res.data.house);
      setLoading(false);
    } catch (error) {
      console.error('데이터 가져오기 실패:', error);
      setError('집 정보를 불러오지 못했습니다.');
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/houses/${HouseId}`,
        { title: editTitle, content: editContent, region: editRegion, price: editPrice },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          }
        }
      );
      alert('수정이 완료되었습니다.');
      setEditMode(false);
      fetchHouse();
    } catch (err) {
      console.log(err);
      alert('수정에 실패했습니다.');
    }
  };

  const handleDel = async () => {
    const confirmDel = window.confirm('정말로 삭제하시겠습니까?');
    if (!confirmDel) return;

    try {
      await axios.delete(
        `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/houses/${HouseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );
      alert('삭제가 완료되었습니다.');
      navigate('/house');
    } catch (err) {
      console.log(err);
      alert('삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (house) {
      setEditTitle(house.title);
      setEditContent(house.content);
      setEditRegion(house.region);
      setEditPrice(house.price);
    }
  }, [house]);

  if (loading) return <HouseDetailContainer>로딩 중...</HouseDetailContainer>;
  if (error || !house) return <HouseDetailContainer>{error || '집 정보를 찾을 수 없습니다.'}</HouseDetailContainer>;

  const mainImageUrl = house
    ? `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app${house.mainImage}`
    : '';

  return (
    <HouseDetailContainer>
      {!editMode &&
        <HouseDetailMainBox>
          <HouseDetailTopBox>
            {my && (
              <HouseEditDelBtnBox>
                <button onClick={handleEdit}>수정</button>
                <button onClick={handleDel}>삭제</button>
              </HouseEditDelBtnBox>
            )}
            <HouseDetailMainImgBox>
              <img src={mainImageUrl} alt="메인 사진" />
            </HouseDetailMainImgBox>
            <HouseDetailInfoContainer>
              <div>
                <HouseDetailInfoBox>
                  <HouseDetailInfoTitleBox>제목</HouseDetailInfoTitleBox>
                  <HouseDetailInfo>
                    {house.title}
                  </HouseDetailInfo>
                </HouseDetailInfoBox>

                <HouseDetailInfoBox>
                  <HouseDetailInfoTitleBox>내용</HouseDetailInfoTitleBox>
                  <HouseDetailInfo>
                    {house.content}
                  </HouseDetailInfo>
                </HouseDetailInfoBox>

                <HouseDetailInfoBox>
                  <HouseDetailInfoTitleBox>지역</HouseDetailInfoTitleBox>
                  <HouseDetailInfo>
                    {house.region}
                  </HouseDetailInfo>
                </HouseDetailInfoBox>

                <HouseDetailInfoBox>
                  <HouseDetailInfoTitleBox>가격</HouseDetailInfoTitleBox>
                  <HouseDetailInfo>
                    {house.price}
                  </HouseDetailInfo>
                </HouseDetailInfoBox>

                <HouseDetailInfoBox>
                  <HouseDetailInfoTitleBox>작성자</HouseDetailInfoTitleBox>
                  <HouseDetailInfo>{house.authorName}</HouseDetailInfo>
                </HouseDetailInfoBox>
              </div>
            </HouseDetailInfoContainer>
          </HouseDetailTopBox>

          <HouseDetailBottomContainer>
            <HouseDetailBottomBox>
              <HouseDetailSubImgBox>
                {house.insideImages && house.insideImages[subHouse] ? (
                  <img
                    src={`https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app${house.insideImages[subHouse]}`}
                    alt={`서브 사진 ${subHouse + 1}`}
                  />
                ) : (
                  <div>이미지를 찾을 수 없습니다.</div>
                )}
              </HouseDetailSubImgBox>
              <HouseDetailSubImgBtnBox>
                {house.insideImages?.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSubHouse(index)}
                    className={subHouse === index ? 'active' : ''}
                  >
                    서브 사진 {index + 1}
                  </button>
                ))}
              </HouseDetailSubImgBtnBox>
            </HouseDetailBottomBox>
          </HouseDetailBottomContainer>
        </HouseDetailMainBox>
      }
      {editMode &&
        <HouseDetailMainBox>
          <form onSubmit={handleEditSubmit} encType="multipart/form-data">
            <HouseCreInfoContainer>
              <div>
                <HouseCreInfoTopTitleBox>
                  <h1>상세 정보</h1>
                </HouseCreInfoTopTitleBox>

                <HouseCreInfoBox>
                  <HouseCreInfoTitleBox>제목</HouseCreInfoTitleBox>
                  <HouseCreInfo>
                    <input
                      type="text"
                      placeholder="제목을 입력하세요."
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </HouseCreInfo>
                </HouseCreInfoBox>

                <HouseCreInfoBox>
                  <HouseCreInfoTitleBox>내용</HouseCreInfoTitleBox>
                  <HouseCreInfo>
                    <input
                      placeholder="내용을 입력하세요."
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  </HouseCreInfo>
                </HouseCreInfoBox>

                <HouseCreInfoBox>
                  <HouseCreInfoTitleBox>지역</HouseCreInfoTitleBox>
                  <HouseCreInfo>
                    <select
                      value={editRegion}
                      onChange={(e) => setEditRegion(e.target.value)}
                      style={{
                        width: '100%',
                        height: '100%',
                        fontSize: '16px',
                        paddingLeft: '20px',
                        border: 'none',
                        backgroundColor: 'white',
                        outline: 'none',
                      }}
                    >
                      <option value="">지역을 선택하세요</option>
                      <option value="봉양면">봉양면</option>
                    </select>
                  </HouseCreInfo>
                </HouseCreInfoBox>

                <HouseCreInfoBox>
                  <HouseCreInfoTitleBox>가격</HouseCreInfoTitleBox>
                  <HouseCreInfo>
                    <input
                      type="text"
                      placeholder="가격을 입력하세요."
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  </HouseCreInfo>
                </HouseCreInfoBox>
              </div>
            </HouseCreInfoContainer>

            <HouseCreBtnBox>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{ backgroundColor: 'white', color: "black" }}
              >
                뒤로
              </button>
              <button
                type="submit"
                style={{ backgroundColor: 'black', color: 'white' }}
              >
                수정
              </button>
            </HouseCreBtnBox>
          </form>
        </HouseDetailMainBox>
      }
    </HouseDetailContainer >
  );
}
export default HouseDetail;

const HouseDetailContainer = styled.div`
  display: flex;
  width: 99vw;
  justify-content: center;
  min-height: 100vh;
  padding-bottom: 80px;
`;

const HouseDetailMainBox = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 130px;
`;

const HouseDetailTopBox = styled.div`
  width: 100%;
  justify-content: space-between;
`;

const HouseDetailMainImgBox = styled.div`
  width: 100%;
  height: 700px;
  border: 1px solid black;
  margin-bottom: 20px;
  img{
    display: flex;
    width: 100%;
    height: 100%;
  }
`;

const HouseDetailInfoContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  div{
    width: 100%;
  margin: 0;
  }
`;

const HouseDetailInfoBox = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
`;

const HouseDetailInfoTitleBox = styled.div`
  flex: 1;
  height: 100%;
  background-color: #F3F2F2;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 17px;
  font-weight: bold;
`;

const HouseDetailInfo = styled.div`
  flex: 4;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 30px;
  font-size: 16px;
`;

const HouseDetailBottomContainer = styled.div`
  display: flex;
  width: 100%;
  height: 500px;
  justify-content: center;
  align-items: center;
`;

const HouseDetailBottomBox = styled.div`
  width: 100%;
  height: 400px;
`;

const HouseDetailSubImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 400px;
  img{
    display: flex;
    width: 50%;
    height: 80%;
  }
`;

const HouseDetailSubImgBtnBox = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  align-items: center;
  margin-top: 40px;
  justify-content: center;
  button{
    display: flex;
    width: 150px;
    height: 30px;
    padding: 20px;
    font-size: 16px;
    font-weight: bold;
    background-color: #C6C6C6;
    color: white;
    border-radius: 40px;
    border: 1px solid black;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;
    &.active{
      background-color: black;
    }
  }
`;

const HouseEditDelBtnBox = styled.div`
  display: flex;
  width: 100%;
  min-height: 100px;
  justify-content: right;
  align-items: center;
  button{
    display: flex;
    width: 100px;
    height: 40px;
    font-size: 20px;
    font-weight: bold;
    border: 1px solid black;
    border-radius: 100px;
    background-color: white;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    cursor: pointer;
  }
`;

const HouseCreImgBox = styled.div`
  width: 100%;
  height: 100px;
  align-items: center;
`;

const HouseCreTitleBox = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  h1 {
    font-size: 20px;
    font-weight: bold;
  }
`;

const HouseCreImgInputBox = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  input {
    font-size: 16px;
  }
`;

const HouseCreInfoContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  div {
    width: 100%;
    margin: 0;
  }
`;

const HouseCreInfoTopTitleBox = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  h1 {
    font-size: 20px;
    font-weight: bold;
  }
`;

const HouseCreInfoBox = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
`;

const HouseCreInfoTitleBox = styled.div`
  flex: 1;
  height: 100%;
  background-color: #f3f2f2;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
`;

const HouseCreInfo = styled.div`
  flex: 4;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 30px;
  font-size: 14px;
  input {
    width: 100%;
    height: 100%;
    background-color: white;
    border: none;
    outline: none;
    font-size: 16px;
    padding-left: 20px;
  }
`;


const HouseCreBtnBox = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: end;
  margin-top: 30px;
  button {
    display: flex;
    background-color: black;
    color: white;
    width: 120px;
    height: 45px;
    padding: 10px;
    font-size: 22px;
    border-radius: 30px;
    border: 1px solid black;
    margin-left: 20px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;
