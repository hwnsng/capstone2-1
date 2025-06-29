import styled from 'styled-components';

function Footer() {
  return (
    <FooterContainer>
      <FooterInfoMainBox>
        <FooterColumn>
          <FooterTitle>의성군 귀촌정보포털</FooterTitle>
          <FooterText>경상북도 의성군 의성읍 군청길 31 (후죽리 509-2)</FooterText>
          <FooterText>우편번호 37337</FooterText>
        </FooterColumn>
        <FooterColumn>
          <FooterSubtitle>연락처</FooterSubtitle>
          <FooterText>전화: 054-830-6606~8</FooterText>
          <FooterText>팩스: 054-830-5910</FooterText>
          <FooterText>이메일: usc@village.go.kr</FooterText>
          <FooterText>운영 시간: 평일 09:00~18:00</FooterText>
        </FooterColumn>
        <FooterColumn>
          <FooterSubtitle>빠른 링크</FooterSubtitle>
          <FooterLink href="https://www.usc.go.kr/village/page.do?mnu_uid=1004">귀농귀촌 종합정보</FooterLink>
          <FooterLink href="https://www.usc.go.kr/village/page.do?mnu_uid=1006">지원정책</FooterLink>
          <FooterLink href="https://www.usc.go.kr/village/page.do?mnu_uid=1008">체험 프로그램</FooterLink>
        </FooterColumn>
      </FooterInfoMainBox>
      <FooterBottom>
        <FooterText>&copy; 2025 의성군 귀촌정보포털. All rights reserved.</FooterText>
      </FooterBottom>
    </FooterContainer>
  );
}

export default Footer;

const FooterContainer = styled.div`
  width: 100%;
  background-color: #434653;
  color: #ffffff;
  padding: 40px 20px;
`;

const FooterInfoMainBox = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FooterColumn = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 10px;
`;

const FooterTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: #a7c8b7;
  margin-bottom: 16px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const FooterSubtitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #a7c8b7;
  margin-bottom: 12px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const FooterText = styled.p`
  font-size: 14px;
  color: #ffffff;
  margin: 8px 0;
  font-family: 'Noto Sans KR', sans-serif;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const FooterLink = styled.a`
  font-size: 14px;
  color: #538572;
  text-decoration: none;
  margin: 8px 0;
  display: block;
  transition: color 0.3s ease;
  font-family: 'Noto Sans KR', sans-serif;

  &:hover {
    color: #406a5b;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 20px auto 0;
  text-align: center;
  border-top: 1px solid #777b90;
  padding-top: 20px;
`;