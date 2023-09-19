import styled from "styled-components"
import { SecondaryButton } from "@elements/button";
import { SignIn } from "phosphor-react";
import { CircleWavyCheck } from "phosphor-react";
import { NavigationArrow } from "phosphor-react";
import { User } from "phosphor-react";
import { useRouter } from "next/router";

const BodyContainer = styled.div`
    width: calc(100vw - 40px );
    padding: 0 20px;
    overflow: hidden;
    scroll-behavior: smooth;
    .backdrop{
        position: absolute;
        top: 0px;
        left: 0;
        height: 100%;
    }
    .shape{
        position: absolute;
        right: 200px;
        top: 200px;
    }
`

const First = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: auto;
    position: relative;
    z-index: 2;
    height: 100vh;
`

const Slogan = styled.div`
    display: flex;
    flex-direction: column;
    h1{
        font-size: 70px;
        line-height: 80px;
        margin-bottom: 20px;
    }
    i{
        color: #FFC30B;
        padding-right: 30px;
    }
`
const Phone = styled.div`
    margin-right: 100px;
`

const PortfolioCard = styled.div`
    display: flex;
    flex-direction: column;
    @media (max-width: 769px) {
      display: none;
    }
`
const AboutUs = styled.div`
    display: flex;
    max-width: 1400px;
    margin: auto;
    flex-direction: column;
    margin-top: 100px;
    padding-bottom: 50px;
    position: relative;
    z-index: 2;
`


const Brands = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 1400px;
    margin: auto;
    margin-top: 100px;
    position: relative;
    z-index: 2;
    h2{
        margin-bottom: 20px;
    }
`

const BrandsCards = styled.div`
    display: flex;
    justify-content: center;
    column-gap: 50px;
    align-items: center;
`

const Brand = styled.div`
    background: ${({theme}) => theme.colors.box};
    border-radius: 5px;
    padding: 30px;
    display: flex;
    width: 180px;
    flex-direction: column;
    align-items: center;
    img{
        height: 70px;
        margin-bottom: 20px
    }

`

const DevelopersCards = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    column-gap: 100px;
    align-items: center;
    margin-top: 20px;
`

const Developer = styled.div`
    max-width: 250px;
    max-height: 370px;
    overflow: hidden;
    border: 1px solid black;
    border-radius: 5px;
    img{
        max-width: unset;
    }
    position: relative;
    h4{
        color: white;
        position: absolute;
        z-index: 2;
        bottom: 10px;
        left: 10px;
    }
    .overlay{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0));
    }
`

const Waleed = styled(Developer)`
    img{
        width: 300px
    }
`

const ShahFahad = styled(Developer)`
    img{
        height: 400px;
        margin-left: -70px;
    }

`

const RegisterButton = styled(SecondaryButton)`
    color: black;
    font-weight: bold;
    margin-top: 20px;
`

const FlexRow = styled.div`
    display: flex;
    align-items: center;
    column-gap: 10px;
    &.mb-2{
        margin-bottom: 10px;
    }
    
    &.mt-4{
        margin-top: 20px;
    }
`

export const Body = () => {

    const {
        push
    } = useRouter();

    return (
        <BodyContainer>
            <img className="backdrop" src="/images/landing/lines.svg" />
            <img className="shape" src="/images/landing/shape.svg" />
            <First id="landing" >
                <Slogan>
                    <h1>The Best <br></br><i>Pal </i> For <br></br>Your Car</h1>
                    <p> GET YOUR CAR SERVED IN  <b>NEW</b> AND <b>BETTER</b> WAY.<br></br>
                        THE FUTURE OF CAR SERVICES IS HERE.</p>
                    <RegisterButton onClick={()=>push('/signup')} ><SignIn size={25} weight="bold" color="black" />Register Now</RegisterButton>
                </Slogan>

                <Phone>
                    <img src="/images/landing/phone.svg" />
                </Phone>

                <PortfolioCard>
                    <FlexRow>
                        <h3>Verified</h3>
                        <CircleWavyCheck size={20} weight="fill" color="#4CBB17" />
                    </FlexRow>
                    <h3>Service Providers</h3>
                    <FlexRow className="mb-2 mt-4">
                        <NavigationArrow size={32} weight="duotone" color="black" />
                        <h3>Major Cities</h3>
                    </FlexRow>
                    <p>Our Providers are working in all the<br></br> Provincial Capitals of the State.</p>
                    <FlexRow className="mb-2" >
                        <User size={32} weight="fill" />
                        <h3>1.1k+ </h3>
                    </FlexRow>
                    <p>More than 1100 users have already<br></br> shown interest. Be the part of future.</p>
                </PortfolioCard>
            </First>
            <Brands id="brands" >
                <h2>Affiliated Brands</h2>
                <BrandsCards>
                    <Brand>
                        <img src="/images/landing/mg.png" />
                        <h4>MG</h4>
                        <span>Peshawar</span>
                    </Brand>
                    <Brand>
                        <img src="/images/landing/honda.png" />
                        <h4>Honda</h4>
                        <span>Peshawar</span>
                    </Brand>
                    <Brand>
                        <img src="/images/landing/toyota.png" />
                        <h4>Toyota</h4>
                        <span>Peshawar</span>
                    </Brand>
                </BrandsCards>
            </Brands>

            <AboutUs id="about" >
                <h2>Stake Holders</h2>
                <DevelopersCards>
                    <Waleed>
                        <div className="overlay" ></div>
                        <img src="/images/landing/waleed.JPG"/>
                        <h4>Waleed Ahmed</h4>
                    </Waleed>
                    <ShahFahad>
                        <div className="overlay" ></div>
                        <img src="/images/landing/fahad.jpg"/>
                        <h4>Shah Fahad</h4>
                    </ShahFahad>
                </DevelopersCards>
            </AboutUs>

        </BodyContainer>
    )
}