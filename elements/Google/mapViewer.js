import React, { useEffect, useState } from "react";
import { Modal, Text } from "@nextui-org/react";
import GoogleMap from "@page-components/booking/map";
import styled from "styled-components";

const StyledModal = styled(Modal)`
    min-width: 550px;
    margin-left: -100px;
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
                <GoogleMap
                    initialCords={latLng}
                    currentLatLng={currentLatLng}
                />
            </Modal.Body>
        </StyledModal>
    );
}