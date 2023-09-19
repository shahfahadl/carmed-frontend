import React, { useState } from "react";
import { Modal, Text } from "@nextui-org/react";
import GoogleMap from "@page-components/booking/map";
import styled from "styled-components";
import { PrimaryButton } from "@elements/button";
import Autocomplete from "@page-components/booking/autocomplete";

const StyledModal = styled(Modal)`
    height: 770px;
    min-width: 550px;
    margin-left: -100px;
`

export default function AddressPopup({open, onClose}) {
    const [name, setName] = useState("")
    const [currentLatLng, setCurrentLatLng] = useState({
        lat: 33,
        lng: 70
    })

    const onCloseHandler = () => {
        onClose(currentLatLng, name);
    }

    return (
        <StyledModal
            closeButton
            aria-labelledby="modal-title"
            open={open}
            onClose={onCloseHandler}
        >
            <Modal.Header>
                <Text id="modal-title" size={18}>
                    Origin
                    <Text b size={18}>
                        &nbsp;{name}
                    </Text>
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Autocomplete
                    onAddressChange={setCurrentLatLng}
                    label="Search Location"
                    setApproxiamteName={setName}
                    open={open}
                />
                <GoogleMap
                    currentLatLng={currentLatLng}
                    setCurrentLatLng={setCurrentLatLng}
                    setApproxiamteName={setName}
                />
            </Modal.Body>
            <PrimaryButton className="ml-4 my-3" onClick={() => onCloseHandler()} >Select Location</PrimaryButton>
        </StyledModal>
    );
}