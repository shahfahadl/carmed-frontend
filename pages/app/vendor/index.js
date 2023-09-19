import React, { useState } from 'react'
import styled from "styled-components";
import { OutlinedButton } from '@elements/button';
import { AppTitle } from '@elements/common';
import { User } from "phosphor-react";
import { theme } from '@utility/theme'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import { Modal, Text } from "@nextui-org/react";
import { InputFormField } from "@elements/input";
import { useAuth } from "@contexts/auth"
import toast from 'react-hot-toast';
import { orderVendorPending } from '@hooks/watchOrder';
import VendorService from '@utility/services/vendor';
import { CommonUtility } from '@utility/common';
import { Loading } from "@nextui-org/react";
import { commonConstants } from '@utility/constants/api';
import MapViewer from '@elements/Google/mapViewer';
import { skillsMap } from '@utility/constants/common';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const OrderContainer = styled.div`
  position: relative;
  margin: 10px 0;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.yellow};
  width: 90%;
  box-shadow: 0px 0px 7px ${({ theme }) => theme.colors.boxShadow};
  color: white;
  border-radius: 10px;
  transition: 0.3s ease-in-out;
  :hover {
    transform: translateY( -2px)
  }
`
const RowMain = styled.div`
  padding: 25px;
  width: 100%;
  height: max height;
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
    margin-left: 10px;
  }
  
  p:nth-child(2) span{
    color: #919191;
  }
`

const MapButton = styled.button`
  margin-left: 30px;
  padding: 0 5px ;
  font-size: 12px;
  border-radius: 10px;
  border: 1px solid black;
  outline: none;
  background-color: #ffefa1;
  font-weight: 600;
  cursor: pointer;
  float: right;
`

const RowRight = styled.div`
  color: #919191;
  p {
    text-align: right;
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

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const ProfileImageContainer = styled.div`
  width: 60px;
  height: 60px;
  border: 2px solid white;
  margin: 10px;
  margin-left: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  over-flow: hidden;
`;

const Schema = yup.object().shape({
  myBid: yup.number("Bid is required").required("Your bid is required"),
});

const OrderRow = ({ order, loadingBid, visibilityHandler, showMapForOrder ,userId, user}) => {

  const [loading, setLoading] = useState(false)
  const url = order.userProfile
  const myBid = order.requests.find((request)=>request.vendorId === userId)?.bid || 0

  async function acceptOrder() {
    try {
      setLoading(true);
      const payload = {
        ...order ,
        vendorId: user.id,
        vendorName: user.name,
        price: order.bid,
        id: order.id,
      }
      await VendorService.acceptOrder(payload);
      toast.success("Order Accepted")
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (<OrderContainer>
    <RowMain>
      <RowLeft>
        <ProfileImageContainer>
          {order.userProfile ? <ProfileImage src={url} /> : <User size={32} />}
        </ProfileImageContainer>
        <div>
          <p>Name <span>{order.userName}</span></p>
          <p>Location <span>{order.location}</span> <MapButton onClick={() => showMapForOrder(order)} >Show maps</MapButton></p>
          <p>Problem <span>{skillsMap[order.problem] || order.problem}</span></p>
          {(!!order.time && !!order.date) ? <div>
              <Text h5 className='mt-4' >Appointment</Text>
              <p>Time <span>{order.time}</span></p>
              <p>Date <span>{order.date}</span></p>
            </div>
              : <></>
            }
        </div>
      </RowLeft>
      <RowRight>
        <p>
          Price <span>PKR {CommonUtility.currencyFormat(order.bid)}</span> <br/>
          {!!order.alreadyBid && <>My-Bid <span>PKR {CommonUtility.currencyFormat(myBid)}</span> </>}
        </p>
        <span>
          <OutlinedButton onClick={acceptOrder} loading={loading} color={theme.colors.green}>Accept</OutlinedButton>
          <OutlinedButton className="ml-2" color={theme.colors.blue} onClick={() => visibilityHandler(order)} loading={loadingBid} >{!!order.alreadyBid? "Update Bid":"Bid"}</OutlinedButton>
        </span>
      </RowRight>
    </RowMain>
  </OrderContainer>)
}

export default function OrderNow() {

  const { data: orders, loading } = orderVendorPending();
  const [currentOrder, setCurrentOrder] = useState(false);
  const [loadingBid, setLoadingBid] = useState(false);
  const { user } = useAuth();

  const [mapOpen, setMapOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null)

  const visibilityHandler = (order) => setCurrentOrder(order);
  const closeHandler = () => {
    setCurrentOrder(null);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const submit = async (data) => {
    if(!currentOrder) return;

    setLoadingBid(true);
    const payload = {
      id: currentOrder.id,
      request: {
        vendorId: user.id,
        vendorName: user.name,
        bid: data.myBid,
        vendorProfile: user.profile
      }
    }

    try {
      await VendorService.placeBid(payload);
      toast.success("Bid Placed")
    } catch (error) {
      toast.error("Invalid credentials")
    } finally {
      setLoadingBid(false)
      reset({})
      closeHandler()
    }
  }

  const showMapForOrder = (order) => {
    if(!order.latLng){
      toast.error(commonConstants.constantErrorName);
      return;
    }
    
    setMapOpen(true);
    setCurrentLocation({
      name: order.location,
      latLng: order.latLng
    });
  }

  const closeMap = () => {
    setMapOpen(false);
    setCurrentLocation(null);
  }

  return (
    <Container>
      <AppTitle name="Available Orders" />
      {loading && <Loading/> }
      {orders.map((order) => (
        <OrderRow
          order={order}
          loadingBid={loadingBid}
          showMapForOrder={showMapForOrder}
          visibilityHandler={visibilityHandler}
          userId={user.id}
          user={user}
        />
      ))}
      {(!loading && orders.length === 0)? "Nothing here yet" : ''}
      <MapViewer
        open={mapOpen}
        onClose={closeMap}
        latLng={currentLocation?.latLng}
        placeName={currentLocation?.name}
      />
      <Modal
        closeButton
        open={!!currentOrder}
        onClose={closeHandler}
      >
        {loadingBid && <Loading/>}
        <Modal.Header>
          <Text size={18}>
            Place your Bid
          </Text>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(submit)}>
            <InputFormField
              control={control}
              hint={errors?.name?.message}
              label={'Your Bid'}
              name="myBid"
              width={'15vw'}
              placeholder={'3000'}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <OutlinedButton color={theme.colors.green} size={15} onClick={() => handleSubmit(submit)()} >
            Place Bid
          </OutlinedButton>
          <OutlinedButton onClick={closeHandler} size={15} color={theme.colors.red} >
            Close
          </OutlinedButton>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
