import { PrimaryButton } from "@elements/button"
import styled from "styled-components";
import { SignIn } from "phosphor-react";
import logo from '../../public/images/landing/logo.svg'

const NavbarContainer = styled.div`
    display: flex;
    max-width: 1400px;
    width: 100%;
    justify-content: space-between;
    background-color: white;
    padding: 10px 0;
    .logo{
        display: flex;
        align-items: center;
        column-gap: 10px;
    }
`
const NavItems = styled.div`
    display: flex;
    justify-content: center;
    column-gap: 30px;
    justify-content: space-between;
    margin-top: 5px;
    p{
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
    }
    a {
        color: black;
    }
    p:hover {
        transform: scale(1.05);
    }
`

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 20px;
    position: fixed;
    z-index: 4;
    top: 0;
    background-color: white;
    scroll-behavior: smooth;
`

const ButtonContainer = styled.div`
    display: flex;
    column-gap: 5px;
    p{
        padding: 6px 30px;
        font-weight: bold;
    }
`

const Logo = styled.img`
    height: 18px;
`

export const Navbar = () => {
    return (
    <Container>
        <NavbarContainer>
            <div className="logo" >
                <Logo src={logo.src} />
                <h3>CarMed</h3>
            </div>
            <NavItems>
                <p><a href="#brands" >Affiliated Brands</a></p>
                <p><a href="#about" >About</a></p>
                <p><a href="/vendor-signup" >Apply As Vendor</a></p>
            </NavItems>
            <ButtonContainer>
                <a href="/login"><PrimaryButton><SignIn size="20" />Login</PrimaryButton></a>
            </ButtonContainer>
        </NavbarContainer>
    </Container>
    )
}