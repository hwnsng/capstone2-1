import styled from 'styled-components';
import search from '@/media/Search.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/loading/loading';
import axios from 'axios';

function Policy() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [policyInfo, setPolicyInfo] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const SearchTitle = (e) => {
    setSearchTitle(e.target.value);
  };

  const fetchPolicy = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/policy/my");
      console.log(res.data.edu_list);
      setPolicyInfo(res.data.edu_list);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchPolicy();
  }, []);
  return (
    <PolicyContainer>
      <PolicyMainBox>
        <PolicyTitleBox>
          <PolicyTitle>지원 정책</PolicyTitle>
        </PolicyTitleBox>
        <SearchBox>
          <form onSubmit={(e) => e.preventDefault()}>
            <SearchIcon src={search} alt="검색 아이콘" />
            <SearchBar placeholder='제목을 입력해주세요.' value={searchTitle} onChange={SearchTitle} />
          </form>
        </SearchBox>
        <FilterContainer>
          <FilterMainBox>
            <div><FilterCheckBox type="checkbox" /><p>준비</p></div>
            <div><FilterCheckBox type="checkbox" /><p>진입</p></div>
            <div><FilterCheckBox type="checkbox" /><p>정착</p></div>
            <div><FilterCheckBox type="checkbox" /><p>성장</p></div>
          </FilterMainBox>
        </FilterContainer>
        {policyInfo.map((policy, index) => (
          <PolicyInfoContainer key={index}>
            <PolicyInfoBox onClick={() => navigate(`/policydetail/${index}`)}>
              <div>
                <p>준비</p>
                <p className="active">진입</p>
                <p>정착</p>
                <p>성장</p>
              </div>
              <PolicyInfoTitleBox>{policy.title}</PolicyInfoTitleBox>
              <PolicyInfo>주관 기관 : {policy.chargeAgency}</PolicyInfo>
              <PolicyInfo>담당 부서 : {policy.chargeDept}</PolicyInfo>
              <PolicyInfo>종료일 : {policy.eduEdDt}</PolicyInfo>
            </PolicyInfoBox>
          </PolicyInfoContainer>
        ))}
      </PolicyMainBox>
      {loading && <Loading />}
    </PolicyContainer>
  )
}

export default Policy;

const PolicyContainer = styled.div`
  display: flex;
  width: 99vw;
  min-height: 100vh;
  justify-content: center;
  padding-bottom: 60px;
`;

const PolicyMainBox = styled.div`
  width: 100%;
  margin-top: 140px;
`;

const PolicyTitleBox = styled.div`
  display: flex; 
  width: 100%;
  justify-content: center;
`;

const PolicyTitle = styled.h1`
  font-size: 40px;
  font-weight: bold;
`;

const SearchBox = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  form {
    display: flex;
    width: 55%;
    height: 45px;
    background-color:rgb(240, 240, 240);
    justify-content: center;
    align-items: center;
    border-radius: 50px;
  };
`;

const SearchIcon = styled.img`
  display: flex;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const SearchBar = styled.input`
  font-size: 18px;
  border: none;
  outline: none;
  width: 90%;
  background: none;
  padding-left: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
  justify-content: center;
  margin-top: 20px;
`;
const FilterMainBox = styled.div`
  display: flex;
  width: 55%;
  height: 50px;
  background-color: rgb(240, 240, 240);
  border-radius: 50px;
  justify-content: space-between;
  align-items: center;
  padding: 0px 30px;
  div{
    display: flex;
    align-items: center;
    gap: 10px;
    p{
      display: flex;
      width: 70px;
      height: 30px;
      background-color: white;
      border: 1px solid black;
      border-radius: 30px;
      justify-content: center;
      align-items: center;
      font-size: 18px;
    }
  }
`;

const FilterCheckBox = styled.input`
  display: flex;
  width: 27px;
  height: 27px;
  cursor: pointer;
`;

const PolicyInfoContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 30px;
`;

const PolicyInfoBox = styled.div`
  width: 80%;
  height: 220px;
  padding: 20px 30px;
  border: 1px solid black;
  border-radius: 40px;
  align-items: start;
  cursor: pointer;
   div{
    display: flex;
    width: 100%;
    align-items: center;
    gap: 10px;
    p{
      display: flex;
      width: 70px;
      height: 30px;
      background-color: white;
      border: 1px solid black;
      border-radius: 30px;
      justify-content: center;
      align-items: center;
      font-size: 17px;
      &.active{
        background-color: #74C69D;
        color: white;
      }
    }
  }
`;

const PolicyInfoTitleBox = styled.div`
  display: flex;
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
`;

const PolicyInfo = styled.div`
  display: flex;
  width: 100%;
  font-size: 18px;
  margin-top: 10px;
`;