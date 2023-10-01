import styled from "styled-components";
import { SimpleNavbar } from "@page-components/landing/navbar";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  background: white;
  margin-top: 50px;
  height: fit-content;
  border-radius: 5px;
  padding: 0 50px;
`;

const LoginHeading = styled.div`
  margin-top: 60px;
  width: max-content;
`;

const BackgroundContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-position: center;
  background-size: cover;
  padding-top: 80px;
  .overlay {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 1;
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 100, 0, 1), rgba(255, 0, 100, 1));
  }
  .forgot{
    color: rgba(0,150,255);
  }
`;

export default function ForgotPassword() {

  return (
    <>
      <SimpleNavbar />
      <BackgroundContainer>
        <div className="overlay" />
        <MainContainer>
          <LoginHeading>
            <h2>You've been blocked</h2>
          </LoginHeading>
          <div className="my-4 pb-4" >
            Contact Administrator at <a href = "mailto:carmed.contact4@gmail.com?subject = Why am I blocked" >carmed.contact4@gmail.com</a>
          </div>
        </MainContainer>
      </BackgroundContainer>
    </>
  );
}
