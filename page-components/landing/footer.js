import styled from "styled-components"
import { InstagramLogo } from "phosphor-react";
import { FacebookLogo } from "phosphor-react";
import { LinkedinLogo } from "phosphor-react";
import { theme } from "@utility/theme";
import LogoImage from '../../public/images/landing/logoYellow.svg'

const FooterContainer = styled.div`
    display: flex;
    width: 100%;
    max-width: 1400px;
    justify-content: space-between;
    padding: 10px 0;
    h3{
        color: ${({ theme }) => theme.colors.yellow};
    }
    margin: auto;
`
    
const Container = styled.div`
    width: 100vw;
    background-color: ${({ theme }) => theme.colors.darkPurple};
    z-index: 2;
    position: relative;
    padding: 0 20px;
`

const Logo = styled.div`
    display: flex;
    align-items: center;
    img {
        height: 16px
    }
`

const Icons = styled.div`
    display: flex;
    column-gap: 5px;
`
export const Footer = () => {
    return (
        <Container>
            <FooterContainer>
                <Logo>
                    <img src={LogoImage.src} />&nbsp;<h3>CarMed.</h3>
                </Logo>
                <Icons>
                    <InstagramLogo size={32} weight="fill" color={theme.colors.box} />
                    <FacebookLogo size={32} weight="fill" color={theme.colors.box} />
                    <LinkedinLogo size={32} weight="fill" color={theme.colors.box} />
                </Icons>
            </FooterContainer>
        </Container>
    )
}