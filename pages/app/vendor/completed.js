import React from 'react'
import styled from "styled-components";
import { AppTitle, CardsContainer } from '@elements/common';
import { orderVendorCompleted } from '@hooks/watchOrder';
import { Loading, Text } from '@nextui-org/react';
import { User } from 'phosphor-react';
import { CommonUtility } from '@utility/common';
import { RatingStar } from '@elements/input';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const OrderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.yellow};
  width: 90%;
  box-shadow: 0px 0px 7px ${({ theme }) => theme.colors.boxShadow};
  color: white;
  border-radius: 10px;
  margin: 10px 0;
  transition: 0.3s ease-in-out;
  :hover {
    transform: translateY( -2px)
  }
`
const RowMain = styled.div`
  padding: 25px;
  width: 100%;
  background-color: white;
  border-radius: 0 10px 10px 0;
  color: black;
  display: flex;
  justify-content: space-between;
  .left p{
    font-weight: 700;
  }
  .left p span{
    font-weight: 500;
    opacity: 0.6;
    margin-left: 10px;
  }
`

const RowLeft = styled.div`
  p{
    width: 500px;
    font-weight: 700;
  }
  p span{
    font-weight: 500;
    color: #919191;
    margin-left: 10px;
  }
  
  p:nth-child(2) span{
    color: #919191;
    opacity: 0.7;
  }
`

const RowRight = styled.div`
  color: #919191;
  p {
    font-weight: 600;
  }
  p span {
    font-weight: 700;
    margin-left: 10px;
    color: black;
  }
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  div {
    display: flex;
  }
`

const ImageContainer = styled.div`
  height: 60px;
  width: 60px;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  border-radius: 50%;
  margin: 20px 40px;
  margin-left: 10px;
`

const OrderRow = ({ order }) => {
  return (
    <OrderContainer>
      <RowMain>
        <RowLeft>
          <ImageContainer>
            {order.image ? <img /> : <User />}
          </ImageContainer>
          <div className='d-flex'>
            <span className='mr-2' >Order Id</span>
            <b>{order.id}</b>
          </div>
          <div className='d-flex'>
            <span className='mr-2' >Name</span>
            <b>{order.userName}</b>
          </div>
          <div className='d-flex'>
            <span className='mr-2' >Location</span>
            <b>{order.location}</b>
          </div>
          <div className='d-flex'>
            <span className='mr-2' >Problem</span>
            <b>{order.problem}</b>
          </div>
          {(!!order.time && !!order.date) ? <div>
            <Text h5 className='mt-3' >Appointment</Text>
            <div className='d-flex'>
              <span className='mr-2' >Time</span>
              <b>{order.time}</b>
            </div><div className='d-flex'>
              <span className='mr-2' >Date</span>
              <b>{order.date}</b>
            </div>
          </div>
            : <></>
          }
          <div className='d-flex'>
            <span className='mr-2' >Ratings</span>
            <b>{!!order.rating ? <RatingStar rating={Number(order.rating || 0)} /> : 'Not Rated yet'}</b>
          </div>
        </RowLeft>
        <RowRight>
          <p>
            Price <span>{CommonUtility.currencyFormat(order.bid)}</span>
          </p>
        </RowRight>
      </RowMain>
    </OrderContainer>)
}

export default function OrderNow() {

  const { data: orders, loading } = orderVendorCompleted();
  console.log("orders: ", orders)

  return (
    <Container>
      <AppTitle name="Completed" />
      {loading && <Loading />}
      <CardsContainer>
        {orders.map((order) => (
          <OrderRow order={order} />
        ))}
      </CardsContainer>
      {(!loading && orders.length === 0) ? "Nothing here yet" : ''}
    </Container>
  )
}
