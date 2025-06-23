import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '@/components/loading/loading';

function PolicyDetail() {
  const [loading, setLoading] = useState(false);
  const [policyInfo, setPolicyInfo] = useState([]);
  const path = window.location.pathname;
  const policyId = path.split("/")[2];
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
    <PolicyDetailContainer>
      <PolicyDetailMainBox>
        <PolicyDetailTitleBox>
          <PolicyDetailTitle>지원 정책</PolicyDetailTitle>
        </PolicyDetailTitleBox>
        <PolicyDetailInfoContainer>
          <div>
            {policyInfo.map((policy, index) => (
              <div key={index}>
                {policy.title && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>교육명</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.title}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.chargeAgency && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>주관 기관</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.chargeAgency}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.chargeDept && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>담당 부서</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.chargeDept}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.chargeTel && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>담당 전화</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.chargeTel}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.contents && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>내용</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.contents}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.eduTarget && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>교육 대상</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.eduTarget}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.eduStDt && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>교육 시작일</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.eduStDt}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.eduEdDt && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>교육 종료일</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.eduEdDt}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.applStDt && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>신청 시작일</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.applStDt}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.applEdDt && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>신청 종료일</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.applEdDt}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.eduMethod && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>교육 방식</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.eduMethod}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.eduMethod2 && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>교육 방식 2</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.eduMethod2}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.eduMethod3 && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>교육 방식 3</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.eduMethod3}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.eduCnt && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>모집 인원</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{policy.eduCnt}명</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {policy.infoUrl && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>자세한 정보</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>
                      <a href={policy.infoUrl} target="_blank" rel="noopener noreferrer">{policy.infoUrl}</a>
                    </PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
              </div>
            ))}
          </div>
        </PolicyDetailInfoContainer>
      </PolicyDetailMainBox>
      {loading && <Loading />}
    </PolicyDetailContainer>
  )
}

export default PolicyDetail;

const PolicyDetailContainer = styled.div`
  display: flex;
  width: 99vw;
  min-height: 100vh;
  padding-bottom: 100px;
`;

const PolicyDetailMainBox = styled.div`
  width: 100%;
  margin-top: 140px;
`;

const PolicyDetailTitleBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const PolicyDetailTitle = styled.h1`
  font-size: 40px;
  font-weight: bold;
`;

const PolicyDetailInfoContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 60px;
  div{
  margin: 0 auto;
  }
`;

const PolicyDetailInfoBox = styled.div`
  display: flex;
  width: 80%;
  height: 120px;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
`;

const PolicyDetailInfoTitleBox = styled.div`
  display: flex;
  width: 20%;
  height: 100%;
  background-color: #F3F2F2;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
`;

const PolicyDetailInfo = styled.div`
  display: flex;
  width: 80%;
  height: 100%; 
  align-items: center;
  justify-contenr: center;
  padding: 0px 50px;
  font-size: 15px;
`;