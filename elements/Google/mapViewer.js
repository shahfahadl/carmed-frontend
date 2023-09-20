import React, { useEffect, useState } from "react";
import { Modal, Text } from "@nextui-org/react";
import GoogleMap from "@page-components/booking/map";
import styled from "styled-components";

const StyledModal = styled(Modal)`
    min-width: 540px;
    margin-left: -100px;
    .nextui-modal-body{
      padding: 20px !important;
    }
`

const MapContainer = styled.div`
  position: relative;
  .google-button{
    display: flex;
    align-items: center;
    background: rgb(26, 115, 232);
    width: fit-content;
    border-radius: 5px;
    padding: 5px 10px;
    color: white;
    margin-top: 10px;
    img{
      width: 20px;
      margin-left: 5px;
      height: 20px;
      filter: invert(1);
    }
  }
`

export default function MapViewer({open, onClose, latLng, placeName}) {
    const [name, setName] = useState("")
    const [currentLatLng, setCurrentLatLng] = useState({
        lat: 33,
        lng: 70
    })

    const onCloseHandler = () => {
        onClose();
    }

    useEffect(() => {
        setCurrentLatLng(latLng)
    }, [latLng])

    useEffect(() => {
        setName(placeName)
    }, [placeName])

    return (
        <StyledModal
            closeButton
            aria-labelledby="modal-title"
            open={open}
            onClose={onCloseHandler}
        >
            <Modal.Header>
                <Text id="modal-title" size={18}>
                    Location
                    <Text b size={18}>
                        &nbsp;{name}
                    </Text>
                </Text>
            </Modal.Header>
            <Modal.Body>
              <MapContainer>
                <GoogleMap
                    initialCords={latLng}
                    currentLatLng={currentLatLng}
                />
                {currentLatLng?.lat && currentLatLng?.lng && (
                  <a className='google-button' href={`https://www.google.com/maps/dir/?api=1&destination=${currentLatLng?.lat},${currentLatLng?.lng}`} >
                      directions
                      <img src='/images/icons/direction.png' />
                  </a>
                )}
              </MapContainer>
            </Modal.Body>
        </StyledModal>
    );
}