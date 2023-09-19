import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { OutlinedButton } from '@elements/button';
import { AppTitle } from '@elements/common';
import { User } from "phosphor-react";
import { theme } from '@utility/theme'
import { orderVendorProcess } from '@hooks/watchOrder';
import VendorService from '@utility/services/vendor';
import toast from 'react-hot-toast';
import { CommonUtility } from '@utility/common';
import { Loading, Text } from '@nextui-org/react';
import { skillsMap } from '@utility/constants/common';
import MapViewer from '@elements/Google/mapViewer';
import { commonConstants } from '@utility/constants/api';

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
  background-color: ${({theme}) =>theme.colors.yellow};
  width: 90%;
  box-shadow: 0px 0px 7px ${({theme}) =>theme.colors.boxShadow};
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
    color: #919191;
    margin-left: 10px;
  }
  
  p:nth-child(2) span{
    color: #919191;
    opacity: 0.7;
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

const OrderRow = ({order , showMapForOrder}) =>{

  const [ loading , setLoading ] = useState(false)
  const [ cancelLoading , setCancelLoading ] = useState(false)
  const url = order.userProfile
  
  async function completeOrder(){
    try{
      setLoading(true);
      await VendorService.completeOrder({id:order.id});
      toast.success("Order completed")
      setLoading(false)
    }catch(error){
      console.log(error)
    }
  }

  async function cancelOrder(){
    try{
      setCancelLoading(true);
      await VendorService.cancelOrder({id:order.id});
      toast.success("Order canceled")
      setCancelLoading(false)
    }catch(error){
      console.log(error)
    }
  }

  return (
  <OrderContainer>
    <RowMain>
      <RowLeft>
        <ProfileImageContainer>
          {order.userProfile ? <ProfileImage src={url} /> : <User size={32} />}
        </ProfileImageContainer>
        <p>Name <span>{order.userName}</span></p>
        <p>Location <span>{order.location}</span> <MapButton onClick={()=>showMapForOrder(order)} >Show maps</MapButton></p>
        <p>Problem <span>{skillsMap[order.problem] || order.problem}</span></p>
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
          Price <span>{CommonUtility.currencyFormat(order.bid)}</span>
        </p>
        <div>
          <OutlinedButton onClick={cancelOrder} loading={cancelLoading} className="mr-2" color={theme.colors.red} >Cancel</OutlinedButton>
          <OutlinedButton onClick={completeOrder} loading={loading} color={theme.colors.green} >Complete</OutlinedButton>
        </div>
      </RowRight>
    </RowMain>
  </OrderContainer>)
}

export default function OrderNow() {

  const {data: orders, loading} = orderVendorProcess();

  const [mapOpen, setMapOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null)

  const closeMap = () => {
    setMapOpen(false);
    setCurrentLocation(null);
  }

  const showMapForOrder = (order) => {
    if(!order.latLng){
      toast.error(commonConstants.constantErrorName);
      return;
    }

    setCurrentLocation({
      name: order.location,
      latLng: order.latLng
    });
    setMapOpen(true);
  }

  return (
    <Container>
      <AppTitle name="In-Process Orders"/>
      {loading && <Loading/> }
      {orders.map((order)=>(
        <OrderRow order={order} showMapForOrder={showMapForOrder} />
      ))}
      {(!loading && orders.length === 0)? "Nothing here yet" : ''}

      <MapViewer
        open={mapOpen}
        onClose={closeMap}
        latLng={currentLocation?.latLng}
        placeName={currentLocation?.name}
      />
    </Container>
  )
}
