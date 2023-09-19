import React, { useState } from 'react'
import styled from "styled-components";
import { OutlinedButton } from '@elements/button';
import { AppTitle } from '@elements/common';
import { theme } from '@utility/theme'
import { orderUserCompleted } from '@hooks/watchOrder';
import UserService from '@utility/services/user';
import toast from 'react-hot-toast';
import { Loading, Modal, Text } from "@nextui-org/react";
import { RatingStar, SimpleInput } from '@elements/input'
import { CommonUtility } from '@utility/common';

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
`
const ModalContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`

const OrderRow = ({ order }) => {

  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  const [visible, setVisible] = useState(false);
  const visibilityHandler = () => setVisible(true)
  const closeHandler = () => {
    setVisible(false);
  };
  const rateVendor = () => {
    if (rating !== 0) {
      setLoading(true);
      const payload = {
        vendorId: order.vendorId,
        rating: rating,
        id: order.id,
        review: review
      }
      try {
        UserService.rateVendor(payload);
        toast.success("Thanks for your feedback!")
      } catch (error) {
        toast.error("Invalid credentials")
      } finally {
        setLoading(false)
        closeHandler()
      }
    } else {
      toast.error("Please rate your vendor")
    }
  }

  return (
    <OrderContainer>
      <RowMain>
        <RowLeft>
          <p>Vendor Name <span>{order.vendorName}</span></p>
          <p>Problem <span>{order.problem}</span></p>
          <p>Car Type <span>{order.carType}</span></p>
          {(!!order.time && !!order.date) ? <div>
            <Text h5 className='mt-3' >Appointment</Text>
            <p>Time <span>{order.time}</span></p>
            <p>Date <span>{order.date}</span></p>
          </div>
            : <></>
          }
        </RowLeft>
        <RowRight>
          <p>
            Price <span>PKR {CommonUtility.currencyFormat(order.bid)}</span>
          </p>
          {!!order.rating ? 
          <div className='d-flex' >
            <span className='mr-2' >Rating</span>
            <RatingStar rating={order.rating} setRating={setRating} />
          </div>
            :
            <OutlinedButton loading={loading} onClick={visibilityHandler} color={theme.colors.green} >Rate Your Vendor</OutlinedButton>
          }
        </RowRight>
      </RowMain>
      <Modal
        closeButton
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text h4 >
            Rate {order.vendorName}
          </Text>
        </Modal.Header>
        <Modal.Body >
          <ModalContainer>
            <RatingStar rating={rating} setRating={setRating} />
            <SimpleInput label="Review" placeholder="Great experience here" value={review} onChange={(e) => setReview(e.target.value)} />
          </ModalContainer>
        </Modal.Body>
        <Modal.Footer>
          <OutlinedButton color={theme.colors.green} size={15} onClick={rateVendor} >
            Rate
          </OutlinedButton>
          <OutlinedButton onClick={closeHandler} size={15} color={theme.colors.red} >
            Close
          </OutlinedButton>
        </Modal.Footer>
      </Modal>
    </OrderContainer>)
}

export default function OrderNow() {

  const { data: orders, loading } = orderUserCompleted()

  return (
    <Container>
      <AppTitle name="Completed" />
      {loading && <Loading />}
      {orders.map((order) => (
        <OrderRow order={order} />
      ))}
      {(!loading && orders.length === 0) ? "Nothing here yet" : ''}
    </Container>
  )
}
