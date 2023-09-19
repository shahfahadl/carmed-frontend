import styled from "styled-components"

const MainContainer = styled.div`
`
const Heading = styled.div`
    display: flex;
    justify-content: center;
    width: 100vw;
    font-size: xx-large;
    font-weight: 700;
    padding-top: 20px;
`
const ServiceCards = styled.div`
    display: flex;
    flex-direction: column;
`
const LineOne = styled.div`
    display: flex;
    width: 100vw;
    justify-content: space-around;
    margin-top: 100px;
`
const Dent = styled.div`
    width: 250px;
    height: 300px;
    background-color: blue;
    text-align: center;
    border-radius: 15px;
`
const Paint = styled.div`
    width: 250px;
    height: 300px;
    background-color: green;
    text-align: center;
    border-radius: 15px;
`
const Carwash = styled.div`
    width: 250px;
    height: 300px;
    background-color: orange;
    text-align: center;
    border-radius: 15px;
`
const Wheels = styled.div`
    width: 250px;
    height: 300px;
    background-color: pink;
    text-align: center;
    border-radius: 15px;
`
const LineTwo = styled.div`
    display: flex;
    width: 100wv;
    justify-content: space-around;
    margin-top: 80px;
`
const Engine = styled.div`
    width: 250px;
    height: 300px;
    background-color: grey;
    text-align: center;
    border-radius: 15px;
`
const Electrician = styled(Engine)`
    background-color: darkblue;
    color: white;
`
const Carparts = styled.div`
    width: 250px;
    height: 300px;
    background-color: red;
    text-align: center;
    border-radius: 15px;
`
const Tyreshop = styled.div`
    width: 250px;
    height: 300px;
    background-color: purple;
    text-align: center;
    border-radius: 15px;
`
const LineThree = styled.div`
    display: flex;
    width: 100wv;
    justify-content: space-around;
    margin-top: 80px;
    padding-bottom: 50px;
`
const Bumper = styled.div`
    width: 250px;
    height: 300px;
    background-color: black;
    color: white;
    text-align: center;
    border-radius: 15px;
`
const Accessories = styled.div`
    width: 250px;
    height: 300px;
    background-color: Yellow;
    text-align: center;
    border-radius: 15px;
`
const AC = styled.div`
    width: 250px;
    height: 300px;
    background-color: brown;
    text-align: center;
    border-radius: 15px;
`
const Gasstation = styled.div`
    width: 250px;
    height: 300px;
    background-color: darkgrey;
    text-align: center;
    border-radius: 15px;
`
export default function Services() {
    return (

        <MainContainer>


            <Heading>Our Services</Heading>

            <ServiceCards>

            <LineOne>    
                <Dent>Dent</Dent>
                <Paint>Paint</Paint>
                <Carwash>Car Wash</Carwash>
                <Wheels>Wheels</Wheels>
            </LineOne>

            <LineTwo>
                <Engine>Engine</Engine>
                <Electrician>Electrician</Electrician>
                <Carparts>Car Parts</Carparts>
                <Tyreshop>Tyreshop</Tyreshop>
            </LineTwo>

            <LineThree>
                <Bumper>Bumper</Bumper>
                <Accessories>Accessories</Accessories>
                <AC>A C</AC>
                <Gasstation>Gas Station</Gasstation>
            </LineThree>
            </ServiceCards>


        </MainContainer>

    )}