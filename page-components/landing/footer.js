import styled from "styled-components";
import { InstagramLogo } from "phosphor-react";
import { FacebookLogo } from "phosphor-react";
import { LinkedinLogo } from "phosphor-react";
import { theme } from "@utility/theme";
import LogoImage from "../../public/images/landing/logoYellow.svg";

const FooterContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  max-width: 1400px;
  justify-content: space-between;
  padding: 20px 0;
  h2 {
    color: ${({ theme }) => theme.colors.yellow};
  }
  margin: auto;
`;

const Container = styled.div`
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.darkPurple};
  z-index: 2;
  position: relative;
  padding: 0 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  img {
    height: 25px;
    margin: 0px 10px;
  }
`;

const Icons = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 15%;
  & a {
    display: flex;
    align-items: center;
  }
`;
const Copyright = styled.div`
  position: absolute;
  bottom: 5px;
  left: 50%;
  right: 50%;
  transform: translate(-50%);
  color: white;
  font-weight: bold;
  width: max-content;
`;
export const Footer = () => {
  const date = new Date().getFullYear();
  return (
    <Container>
      <FooterContainer>
        <Logo>
          <img src={LogoImage.src} />
          &nbsp;<h2>CarMed</h2>
        </Logo>
        <Icons>
          <a href="https://www.instagram.com/carmedpk/?next=%2F" target="blank">
            <InstagramLogo size={32} weight="fill" color={theme.colors.box} />
          </a>
          <FacebookLogo size={32} weight="fill" color={theme.colors.box} />
          <LinkedinLogo size={32} weight="fill" color={theme.colors.box} />
        </Icons>
      </FooterContainer>
      <Copyright>© {date} CarMed - All rights reserved</Copyright>
    </Container>
  );
};
