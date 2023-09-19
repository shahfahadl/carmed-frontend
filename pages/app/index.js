import React, { useState } from 'react'
import styled from "styled-components";
import { AppTitle } from '@elements/common';
import { PlusCircle, CaretRight } from "phosphor-react";
import { Loading, Text } from "@nextui-org/react";
import { useAuth } from "@contexts/auth"
import { orderUserPending } from '@hooks/watchOrder';
import { useRouter } from 'next/router';
import { CommonUtility } from '@utility/common';
import { carTypesMap, skillsMap } from '@utility/constants/common';
import { OrderNowPopup } from '@page-components/order/orderModal';
import MapViewer from '@elements/Google/mapViewer';

const Main = styled.div`
  position : relative;
  height: 100vh;
`

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  over-flow: auto;
  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
  }
`

const OrderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.yellow};
  width: 90%;
  box-shadow: 0px 0px 7px ${({ theme }) => theme.colors.boxShadow};
  border-radius: 10px;
  transition: 0.3s ease-in-out;
  margin:10px 0;
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
    color: #919191;
    font-weight: 500;
  }

  span{
    color: black;
    margin-left: 10px;
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
  font-weight: 600;
  color: #919191;
  span {
    margin-left: 10px;
    color: black;
  }
`

const CursorPointer = styled.div`
  cursor: pointer ;
  pointer-events: all;
  transition: 0.3s ease-in-out;
  :hover {
    transform: scale(0.9);
  }
`

const RequestsLength = styled.div`
  cursor: pointer;
  position: absolute;
  right: -10px;
  top: -10px;
  padding: 5px;
  font-size: 12px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: ${({ theme }) => theme.colors.red};
`

const OrderRow = ({ id, problem, location, carType, myBid, requestsLength, showMapForOrder, showOrder, order }) => {
  return (
    <OrderContainer>
      <RowMain>
        <RowLeft>
          <p>Problem <span>{skillsMap[problem] || problem}</span></p>
          <p>Location <span>{location}</span> <MapButton onClick={() => showMapForOrder(order)} >Show maps</MapButton></p>
          <p>Car Type <span>{carTypesMap[carType] || carType}</span></p>
          {(!!order.time && !!order.date) ? <div>
            <Text h5 className='mt-3' >Appointment</Text>
            <p>Time <span>{order.time}</span></p>
            <p>Date <span>{order.date}</span></p>
          </div>
            : <></>
          }
        </RowLeft>
        <RowRight>
          My-Bid <span>{CommonUtility.currencyFormat(myBid)}</span>
        </RowRight>
      </RowMain>
      <CursorPointer onClick={() => showOrder(id)} >
        <CaretRight size={25} className='m-2' />
      </CursorPointer>
      {!!requestsLength ?
        <RequestsLength onClick={() => showOrder(id)} >
          Requests: <b>{requestsLength}</b>
        </RequestsLength>
        : <></>
      }
    </OrderContainer>)
}

const NewOrderContainer = styled.div`
  position: absolute;
  pointer-events: none;
  bottom: 0;
  width: 100%;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.green};
  margin-bottom: 30px;
  p {
    font-weight: 600;
  }
`

const NewOrder = ({ setOrderPopup }) => {
  return (
    <NewOrderContainer>
      <CursorPointer onClick={() => setOrderPopup(true)} >
        <PlusCircle size={32} />
      </CursorPointer>
      <p>Get Your Car Fixed!</p>
    </NewOrderContainer>
  )
}

export default function OrderNow() {
  const { data: orders, loading } = orderUserPending()
  const { isVendor } = useAuth();
  const [visible, setVisible] = useState(false);
  const { push } = useRouter()
  const [mapOpen, setMapOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null)

  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
  };

  function showOrder(id) {
    push('/app/order/' + id)
  }

  if (isVendor) {
    push('/app/vendor/')
  }

  const closeMap = () => {
    setMapOpen(false);
    setCurrentLocation(null);
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

  return (
    <Main>
      <Container>
        <div className='top' >
          <AppTitle name="Orders" />
          {loading && <Loading />}
          {orders.map((order) => (
            <OrderRow order={order} showOrder={showOrder} id={order.id} showMapForOrder={showMapForOrder} problem={order.problem} location={order.location} carType={order.carType} myBid={order.bid} requestsLength={order.requests.length} />
          ))}
          {(!loading && orders.length === 0) ? "No orders yet" : ''}
        </div>
        <div>
          <NewOrder setOrderPopup={handler} />
        </div>
        <OrderNowPopup
          open={visible}
          onClose={closeHandler}
        />
      </Container>
      <MapViewer
        open={mapOpen}
        onClose={closeMap}
        latLng={currentLocation?.latLng}
        placeName={currentLocation?.name}
      />
    </Main>
  )
}

