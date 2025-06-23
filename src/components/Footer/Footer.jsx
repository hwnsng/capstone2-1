import styled from 'styled-components';

function Footer() {

  return (
    <FooterContainer>
      <FooterInfoMainBox>
        <FooterInfoBox>
          <h1>실/국/과/소 바로가기</h1>
          <h1>▲</h1>
        </FooterInfoBox>
        <FooterInfoBox>
          <h1>실/국/과/소 바로가기</h1>
          <h1>▲</h1>
        </FooterInfoBox>
        <FooterInfoBox>
          <h1>실/국/과/소 바로가기</h1>
          <h1>▲</h1>
        </FooterInfoBox>
      </FooterInfoMainBox>
      <FooterTitleBox>
        <h1>의성군 귀촌정보포털</h1>
      </FooterTitleBox>
    </FooterContainer>
  )
}

export default Footer;

const FooterContainer = styled.div`
  width: 99vw;
  height: 130px;
  background-color: #434653;
  color: white;
`;

const FooterInfoMainBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
  height: 50%;
  padding-left: 20px;
  padding-top: 20px;
`;

const FooterInfoBox = styled.div`
  display: flex;
  width: 400px;
  height: 40px;
  justify-content: space-between;
  background-color: #777B90;
  padding: 3px 10px 3px 10px;
  border-radius: 10px;
  cursor: pointer;
  h1{
    display: flex;
    align-items: center;
    font-size: 14px;
    color: white;
  }
`;

const FooterTitleBox = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: center;
  h1{
    font-size: 20px;
    font-weight: bold;
  }
`;