import React, { useState } from 'react'
import styled from "styled-components";
import { OutlinedButton } from '@elements/button';
import { AppTitle } from '@elements/common';
import { theme } from '@utility/theme'
import { orderUserProcess } from '@hooks/watchOrder';
import UserService from '@utility/services/user';
import toast from 'react-hot-toast';
import { Loading, Text } from '@nextui-org/react';
import { CommonUtility } from '@utility/common';
import { skillsMap } from '@utility/constants/common';
import MapViewer from '@elements/Google/mapViewer';

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

const OrderRow = ({order , showMapForOrder}) =>{

  const [ loading , setLoading ] = useState(false)

  function cancelOrder(){
    try{
      setLoading(true);
      UserService.cancelOrder({id:order.id});
      toast.success("Order canceled")
      setLoading(false)
    }catch(error){
      console.log(error)
    }
  }

  return (
  <OrderContainer>
    <RowMain>
      <RowLeft>
        <p>Vendor Name <span>{order.vendorName}</span></p>
        <p>Problem <span>{skillsMap[order.problem] || order.problem}</span></p>
        <p>Location <span>{order.location}</span> <MapButton onClick={() => showMapForOrder(order)} >Show Maps</MapButton></p>
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
      <OutlinedButton loading={loading} onClick={cancelOrder} color={theme.colors.red} >Cancel</OutlinedButton>
      </RowRight>
    </RowMain>
  </OrderContainer>)
}

export default function OrderNow() {

  const {data: orders, loading} = orderUserProcess()
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
      <AppTitle name="Process"/>
      {loading && <Loading/> }
      {orders.map((order)=>(
        <OrderRow order={order} showMapForOrder={showMapForOrder} />
      ))}
      <MapViewer
        open={mapOpen}
        onClose={closeMap}
        latLng={currentLocation?.latLng}
        placeName={currentLocation?.name}
      />
    </Container>
  )
}
