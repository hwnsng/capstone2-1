import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/loading/loading';
import Banner from '@/components/Banner/Banner';
import axios from 'axios';
import HouseRecomend from '@/pages/Main/HouseRecomend';
import CommunityRecomend from '@/pages/Main/CommunityRecomend';
import AiMenu from '@/media/aiMenu.png';
import HouseMenu from '@/media/houseMenu.png';
import MentorMenu from '@/media/mentorMenu.png';
import PolicyMenu from '@/media/policyMenu.png';
import CommMenu from '@/media/commMenu.png';

function Main() {
  const navigate = useNavigate();
  const [CommInfo, setCommInfo] = useState([]);
  const [HouseInfo, setHouseInfo] = useState([]);
  const [focusHouse, setFocusHouse] = useState(1);
  const [focusCommunity, setFocusCommunity] = useState(1);
  const [loading, setLoading] = useState(false);

  const menuData = [
    {
      title: '궁금한것 물어보기',
      subtitle: 'AI와 상담하기 ➜',
      image: AiMenu,
      path: '/aichat',
    },
    {
      title: '주거 환경 찾기',
      subtitle: '주거 공고 찾아보기 ➜',
      image: HouseMenu,
      path: '/house',
    },
    {
      title: '멘토/멘티',
      subtitle: '멘토/멘티 알아보기 ➜',
      image: MentorMenu,
      path: '/mentolist',
    },
    {
      title: '지원 정책 보기',
      subtitle: '지원 정책 보러가기 ➜',
      image: PolicyMenu,
      path: '/policy',
    },
    {
      title: '커뮤니티 보기',
      subtitle: '커뮤니티 보러가기 ➜',
      image: CommMenu,
      path: 'community?category=0',
    },
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/posts`,
        {});
      setCommInfo(res.data.content);
      setLoading(false);
    } catch (err) {
      console.error('게시글 불러오기 실패:', err);
      setLoading(false);
    }
  };

  const fetchHouse = async () => {
    try {
      const res = await axios.get(
        `https://port-0-backend-nestjs-754g42aluumga8c.sel5.cloudtype.app/houses`
      );
      setHouseInfo(res.data.houses);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchHouse();
  }, []);

  return (
    <MainContainer>
      <MainBox>
        <Banner />
        <HouseRecomendTitleBox>
          <h1>주거공고</h1>
          <span>
            <h1 className={focusHouse === 1 ? "active" : ""} onClick={() => setFocusHouse(1)}>최신글</h1>•<h1 className={focusHouse === 2 ? "active" : ""} onClick={() => setFocusHouse(2)} >베스트글</h1>
          </span>
        </HouseRecomendTitleBox>
        <HouseRecomendBox>
          {HouseInfo
            .sort((a, b) => b.id - a.id)
            .slice(0, 4)
            .map((item) => (
              <HouseRecomend
                key={item.id}
                HouseId={item.id}
                HouseTitle={item.title}
                Region={item.region}
                Price={item.price}
                HouseImg={item.mainImage}
              />
            ))}
        </HouseRecomendBox>
        <CommunityRecomendTitleBox>
          <h1>커뮤니티</h1>
          <span>
            <h1 className={focusCommunity === 1 ? "active" : ""} onClick={() => setFocusCommunity(1)}>최신글</h1>•<h1 className={focusCommunity === 2 ? "active" : ""} onClick={() => setFocusCommunity(2)} >베스트글</h1>
          </span>
        </CommunityRecomendTitleBox>
        <CommunityRecomendBox>
          {CommInfo
            .sort((a, b) => b.id - a.id)
            .slice(0, 4)
            .map((item) => (
              <CommunityRecomend
                key={item.id}
                CommunityId={item.id}
                CommunityTitle={item.title}
                Author={item.username}
                Content={item.content}
              />
            ))}
        </CommunityRecomendBox>
        <MainPageMenuContainer>
          {menuData.map((item, index) => (
            <MainPageMenuImgBox
              key={index}
              onClick={() => navigate(item.path)}
              $background={item.image}
              $even={index % 2 === 1}
            >
              <MainPageMenuTitleBox>{item.title}</MainPageMenuTitleBox>
              <MainPageGotoBox>{item.subtitle}</MainPageGotoBox>
            </MainPageMenuImgBox>
          ))}
        </MainPageMenuContainer>
      </MainBox>
      {loading && <Loading />}
    </MainContainer>
  );
}

export default Main;

const MainContainer = styled.div`
  display: flex;
  width: 99vw;
  justify-content: center;
  padding-bottom: 100px;
  margin: 0px;
`;

const MainBox = styled.div`
  width: 100%;
  margin-top: 120px;
  max-width: 1200px;
`;

const HouseRecomendBox = styled.div`
  display: flex;
  width: 100%;
  height: 300px;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
`;

const HouseRecomendTitleBox = styled.div`
  width: 100%;
  margin: 0px;
  margin-top: 50px;
  h1{
    font-size: 23px;
    font-weight: bold;
  }
  span{
    display: flex;
    margin-top: 10px;
    cursor: pointer;
    h1{
      height: 25px;
      color: #6D6D6D;
      font-size: 20px;
      &.active{
        color: #000;
        border-bottom: 10px solid #CBFFAE;
      }
    }
  }
`;

const CommunityRecomendBox = styled.div`
  display: flex;
  width: 100%;
  height: 150px;
  justify-content: space-between;
  align-items: center;
  margin: 0px;
  margin-top: 20px;
`;

const CommunityRecomendTitleBox = styled.div`
  width: 100%;
  margin: 0px;
  margin-top: 50px;
  h1{
    font-size: 23px;
    font-weight: bold;
  }
  span{
    display: flex;
    margin-top: 10px;
    cursor: pointer;
    h1{
      height: 25px;
      color: #6D6D6D;
      font-size: 20px;
      &.active{
        color: #000;
        border-bottom: 10px solid #CBFFAE;
      }
    }
  }
`;

const MainPageMenuContainer = styled.div`
  display: flex;
  width: 100%;
  height: 500px;
  margin: 0px;
  margin-top: 50px;
  justify-content: space-between;
  align-items: end;
`;

const MainPageMenuImgBox = styled.div`
  width: 18%;
  height: 90%;
  cursor: pointer;
  background: 
    linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1) 90%, rgba(0,0,0,0.1)),
    url(${props => props.$background}) center no-repeat;
  background-size: cover;
  transition: 0.2s all;
  padding-left: 10px;
  ${props => props.$even && `margin-bottom: 50px;`}
  &:hover {
    transform: scale(1.2);
  }
`;

const MainPageMenuTitleBox = styled.div`
  display: flex;
  width: 90%;
  height: 30px;
  justify-content: center;
  align-items: center;
  background-color: #30B46E;
  color: white;
  border-radius: 50px;
  border: none;
  font-size: 14px;
  font-weight: bold;
  margin-top: 350px;
`;

const MainPageGotoBox = styled.div`
  display: flex;
  font-size: 17px;
  font-weight: 1000;
  margin-left: 5px;
  margin-top: 7px;
`;