import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '@/components/loading/loading';

function PolicyDetail() {
  const [loading, setLoading] = useState(false);
  const [foundPolicy, setFoundPolicy] = useState(null);

  const path = window.location.pathname;
  const rawPolicyId = path.split("/")[2];
  const policyId = rawPolicyId.includes('?') ? rawPolicyId.split('?')[0] : rawPolicyId;

  // 최대 페이지 수 (필요에 따라 조절)
  const maxPage = 8;

  const fetchPolicyByPages = async () => {
    setLoading(true);
    try {
      for (let page = 1; page <= maxPage; page++) {
        const res = await axios.get(`https://port-0-backend-springboot-mbhk52lab25c23a5.sel4.cloudtype.app/policy/my?page=${page}`);
        const policies = res.data.content;

        // 찾는 정책이 있으면 저장하고 중단
        const policy = policies.find(p => p.plcyNo.trim() === policyId.trim());
        if (policy) {
          setFoundPolicy(policy);
          break;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (policyId) {
      fetchPolicyByPages();
    }
  }, [policyId]);

  return (
    <PolicyDetailContainer>
      <PolicyDetailMainBox>
        <PolicyDetailTitleBox>
          {foundPolicy && foundPolicy.plcyNm && (
            <PolicyDetailTitle>{foundPolicy.plcyNm}</PolicyDetailTitle>
          )}
        </PolicyDetailTitleBox>
        <PolicyDetailInfoContainer>
          <div>
            {!foundPolicy && !loading && <div>정책 정보를 찾을 수 없습니다.</div>}
            {foundPolicy && (
              <>
                {foundPolicy.plcyExplnCn && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>정책 설명</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.plcyExplnCn}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.sprvsnInstCdNm && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>주관 부처</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.sprvsnInstCdNm}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.operInstCdNm && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>운영 기관</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.operInstCdNm}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.plcySprtCn && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>지원 내용</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.plcySprtCn}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.plcyAplyMthdCn && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>신청 방법</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.plcyAplyMthdCn}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.aplyUrlAddr && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>신청 페이지</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>
                      <a href={foundPolicy.aplyUrlAddr} target="_blank" rel="noopener noreferrer">
                        {foundPolicy.aplyUrlAddr}
                      </a>
                    </PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.aplyYmd && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>신청 기간</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.aplyYmd}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {(foundPolicy.bizPrdBgngYmd || foundPolicy.bizPrdEndYmd) && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>사업 운영 기간</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>
                      {foundPolicy.bizPrdBgngYmd || "미정"} ~ {foundPolicy.bizPrdEndYmd || "미정"}
                    </PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.srngMthdCn && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>선정 방법</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.srngMthdCn}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.etcMttrCn && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>기타 문의</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.etcMttrCn}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {(foundPolicy.sprtTrgtMinAge || foundPolicy.sprtTrgtMaxAge) && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>지원 가능 연령</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>
                      {foundPolicy.sprtTrgtMinAge || "?"}세 ~ {foundPolicy.sprtTrgtMaxAge || "?"}세
                    </PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.mclsfNm && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>대분류</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.mclsfNm}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
                {foundPolicy.lclsfNm && (
                  <PolicyDetailInfoBox>
                    <PolicyDetailInfoTitleBox>소분류</PolicyDetailInfoTitleBox>
                    <PolicyDetailInfo>{foundPolicy.lclsfNm}</PolicyDetailInfo>
                  </PolicyDetailInfoBox>
                )}
              </>
            )}
          </div>
        </PolicyDetailInfoContainer>
      </PolicyDetailMainBox>
      {loading && <Loading />}
    </PolicyDetailContainer>
  );
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
  max-width: 1200px;
  margin: 0 auto;
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
  color: #538572;
`;

const PolicyDetailInfoContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 40px;
  div{
  margin: 0 auto;
  }
`;

const PolicyDetailInfoBox = styled.div`
  display: flex;
  width: 100%;
  min-height: 120px;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
`;

const PolicyDetailInfoTitleBox = styled.div`
  display: flex;
  width: 20%;
  background-color: #F3F2F2;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
`;

const PolicyDetailInfo = styled.div`
  display: flex;
  width: 80%;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 20px;
  font-size: 15px;
  white-space: pre-wrap;
`;
