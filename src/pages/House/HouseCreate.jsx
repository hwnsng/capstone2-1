import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HouseCreate() {
  const navigate = useNavigate();

  const [mainFile, setMainFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [region, setRegion] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMainFileChange = (e) => {
    setMainFile(e.target.files[0]);
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      alert('서브 이미지는 최대 3개까지만 업로드 가능합니다.');
    } else {
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainFile) return alert('메인 이미지를 선택하세요.');
    if (!title.trim()) return alert('제목을 입력하세요.');
    if (!content.trim()) return alert('내용을 입력하세요.');
    if (!region.trim()) return alert('지역을 입력하세요.');
    if (!price.trim()) return alert('가격을 입력하세요.');

    const formData = new FormData();
    formData.append('mainFile', mainFile);

    files.forEach((file) => {
      formData.append('files', file);
    });

    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('region', region.trim());
    formData.append('price', price.trim());

    try {
      setIsLoading(true);
      await axios.post(
        'https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/houses',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      alert('주택 등록 성공!');
      navigate('/house');
    } catch (error) {
      console.error(error);
      alert('등록 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HouseCreContainer>
      <HouseCreMainBox>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <HouseCreImgBox>
            <HouseCreTitleBox>
              <h1>메인 이미지</h1>
            </HouseCreTitleBox>
            <HouseCreImgInputBox>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainFileChange}
                disabled={isLoading}
              />
            </HouseCreImgInputBox>
          </HouseCreImgBox>

          <HouseCreImgBox style={{ marginTop: '40px', height: 'auto' }}>
            <HouseCreTitleBox>
              <h1>서브 이미지 (최대 3개)</h1>
            </HouseCreTitleBox>
            <HouseCreImgInputBox>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                disabled={isLoading}
              />
            </HouseCreImgInputBox>
          </HouseCreImgBox>

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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                  />
                </HouseCreInfo>
              </HouseCreInfoBox>

              <HouseCreInfoBox>
                <HouseCreInfoTitleBox>내용</HouseCreInfoTitleBox>
                <HouseCreInfo>
                  <input
                    placeholder="내용을 입력하세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isLoading}
                  />
                </HouseCreInfo>
              </HouseCreInfoBox>

              <HouseCreInfoBox>
                <HouseCreInfoTitleBox>지역</HouseCreInfoTitleBox>
                <HouseCreInfo>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    disabled={isLoading}
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
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={isLoading}
                  />
                </HouseCreInfo>
              </HouseCreInfoBox>
            </div>
          </HouseCreInfoContainer>

          <HouseCreBtnBox>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              style={{ backgroundColor: 'white', color: '#333' }}
            >
              뒤로
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: 'black', color: 'white' }}
            >
              {isLoading ? '등록중...' : '등록'}
            </button>
          </HouseCreBtnBox>
        </form>
      </HouseCreMainBox>
    </HouseCreContainer>
  );
}

export default HouseCreate;

const HouseCreContainer = styled.div`
  display: flex;
  width: 99vw;
  justify-content: center;
  padding-bottom: 30px;
  min-height: 100vh;
`;

const HouseCreMainBox = styled.div`
  width: 100%;
  max-width: 1200px;
  margin-top: 130px;
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
    &:disabled {
      background-color: #ccc;
      color: #999;
      cursor: not-allowed;
    }
  }
`;
