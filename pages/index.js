import { Body } from "@page-components/landing/body"
import { Footer } from "@page-components/landing/footer"
import { Navbar } from "@page-components/landing/navbar"
import styled from "styled-components"

const BodyContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  scroll-behavior: smooth;
`
export default function Home() {
  
  return (
    <BodyContainer>
      <Navbar/>
      <Body/>
      <Footer/>
    </BodyContainer>
  )
}
