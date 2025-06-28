import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function HouseCreate() {
  const navigate = useNavigate();

  const [mainFile, setMainFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [region, setRegion] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mainPreview, setMainPreview] = useState(null);
  const [filePreviews, setFilePreviews] = useState([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  const handleMainFileChange = (e) => {
    const file = e.target.files[0];
    setMainFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setMainPreview(null);
    }
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      toast.warning('서브 이미지는 최대 3개까지만 업로드 가능합니다.');
      return;
    }

    setFiles(selectedFiles);

    const previewList = [];

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previewList.push(reader.result);
        if (previewList.length === selectedFiles.length) {
          setFilePreviews(previewList);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainFile) return toast.warning('메인 이미지를 선택하세요.');
    if (!title.trim()) return toast.warning('제목을 입력하세요.');
    if (!content.trim()) return toast.warning('내용을 입력하세요.');
    if (!region.trim()) return toast.warning('지역을 입력하세요.');
    if (!price.trim()) return toast.warning('가격을 입력하세요.');

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
      toast.success('주택 등록 성공!');
      navigate('/house');
    } catch (error) {
      console.error(error);
      toast.error('등록 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HouseCreContainer>
      <HouseCreMainBox>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <HouseCreImgBox>
            <HouseCreTitleRow>
              <h1>메인 이미지</h1>
              <label className="upload-label">
                이미지 선택
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainFileChange}
                  disabled={isLoading}
                />
              </label>
            </HouseCreTitleRow>
            {mainPreview && (
              <PreviewContainer>
                <img src={mainPreview} alt="메인 미리보기" />
              </PreviewContainer>
            )}
          </HouseCreImgBox>

          <HouseCreImgBox style={{ marginTop: '40px' }}>
            <HouseCreTitleRow>
              <h1>서브 이미지 (최대 3개)</h1>
              <label className="upload-label">
                이미지 선택
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                  disabled={isLoading}
                />
              </label>
            </HouseCreTitleRow>
            {filePreviews.length > 0 && (
              <PreviewContainer>
                <img src={filePreviews[currentPreviewIndex]} alt={`서브 미리보기 ${currentPreviewIndex + 1}`} />
                <div className="nav-wrapper">
                  <div className="nav-buttons">
                    <button
                      type="button"
                      onClick={() => setCurrentPreviewIndex(prev => Math.max(prev - 1, 0))}
                      disabled={currentPreviewIndex === 0}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPreviewIndex(prev => Math.min(prev + 1, filePreviews.length - 1))}
                      disabled={currentPreviewIndex === filePreviews.length - 1}
                    >
                      →
                    </button>
                  </div>
                  <div className="index-indicator">
                    {currentPreviewIndex + 1} / {filePreviews.length}
                  </div>
                </div>
              </PreviewContainer>
            )}
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
              style={{ backgroundColor: '#538572', color: 'white' }}
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
  margin-top: 120px;
`;

const HouseCreImgBox = styled.div`
  width: 100%;
  min-height: 100px;
  align-items: center;
  justify-content: left;
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
    color: #538572;
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
  color: #538572;
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
    background-color: #538572;
    color: white;
    width: 120px;
    height: 45px;
    padding: 10px;
    font-size: 22px;
    border-radius: 30px;
    border: 1px solid #538572;
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

const HouseCreTitleRow = styled.div`
  display: flex;
  align-items: center;
  height: 50px;

  h1 {
    font-size: 20px;
    font-weight: bold;
    color: #538572;
  }

  .upload-label {
    font-size: 14px;
    background-color: #538572;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    margin-left: 50px;
    input {
      display: none;
    }
  }
`;

const PreviewContainer = styled.div`
  margin-top: 15px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 50px;
  img {
    width: 100%;
    max-width: 600px;
    border-radius: 20px;
    object-fit: cover;
  }

  .nav-wrapper {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 16px;
    color: #555;
  }

  .nav-buttons {
    display: flex;
    gap: 10px;

    button {
      padding: 6px 12px;
      border-radius: 10px;
      border: 1px solid #ccc;
      background-color: #538572;
      cursor: pointer;
      color: white;

      &:disabled {
        background-color: #538572;
        cursor: not-allowed;
      }
    }
  }
`;