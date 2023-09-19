import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { AppTitle } from "@elements/common";
import { CaretLeft, HouseLine } from "phosphor-react";
import { orderUser } from "@hooks/watchOrder";
import { MuteButton, OutlinedButton } from "@elements/button";
import { theme } from "@utility/theme";
import UserService from "@utility/services/user";
import { InputFormField, RatingStar } from "@elements/input";
import toast from "react-hot-toast";
import { CommonUtility } from "@utility/common";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loading, Modal, Text, Checkbox } from "@nextui-org/react";
import AddressPopup from "@elements/Google/addressSelector";
import {
  carTypeOptions,
  carTypesMap,
  skillsMap,
  skillsOption,
} from "@utility/constants/common";
import { DropdownFormField } from "@elements/dropdown";

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  width: 95%;
  > div {
    margin-left: 50%;
    transform: translateX(calc(-50% - 32px));
  }
`;

const CursorPointer = styled.span`
  cursor: pointer;
`;
const DetailsContainer = styled.div`
  width: 90%;
  display: flex;
  justify-content: center;
`;

const OrderDetails = styled.div`
  width: 50%;
  padding-top: 50px;
  > h5 {
    margin: 5px;
  }
`;

const VendorRequestsContainer = styled.div`
  width: 50%;
  text-align: center;
`;

const VendorRequests = styled.div`
  height: 70vh;
  over-flow: auto;
  padding: 10px;
  background-color: #efefef;
  width: 100%;
  text-align: start;
  border-radius: 10px;
`;

const RequestContainer = styled.article`
  border-radius: 10px;
  background-color: white;
  padding: 20px;
  margin-bottom: 10px;
  h5:nth-child(4) {
    display: flex;
    align-items: center;
  }
`;

const FloatRight = styled.h5`
  float: right;
`;

const LowerOpacity = styled.span`
  opacity: 0.6;
`;

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

const LocationName = styled.div`
  font-size: 15px;
  margin-bottom: 5px;
  font-weight: 600;
`;

const StyledMuteButton = styled(MuteButton)`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-content: start;
`;

const Request = ({ request, id }) => {
  const url = request.vendorProfile;
  const [loading, setLoading] = useState(false);
  const ratingValue = (() => {
    if (request.ratings.length === 0) return 0;
    let sum = 0;
    request.ratings.forEach((rating) => {
      sum += rating.rating;
    });
    let result = sum / request.ratings.length;

    return Math.round(result);
  })();
  const { push } = useRouter();

  async function acceptRequest() {
    try {
      setLoading(true);
      const payload = {
        vendorId: request.vendorId,
        vendorName: request.vendorName,
        bid: request.bid,
        id: id,
        vendorProfile: request.vendorProfile,
      };
      UserService.acceptRequest(payload);
      toast.success("Request Accepted");
      setLoading(false);
      push("/app/process");
    } catch (error) {
      console.log("Error : ", error);
    }
  }

  return (
    <RequestContainer>
      <FloatRight>
        Offer: {CommonUtility.currencyFormat(request.bid)} <br />
        <ProfileImageContainer>
          <ProfileImage src={url} />
        </ProfileImageContainer>
      </FloatRight>
      <h5>
        Name <LowerOpacity>{request.vendorName}</LowerOpacity>
      </h5>
      <h5>
        Contact <LowerOpacity>Not available</LowerOpacity>
      </h5>
      <h5>
        Ratings &nbsp;{" "}
        {request.ratings.length > 0 ? (
          <RatingStar rating={ratingValue} hover={false} />
        ) : (
          <LowerOpacity>Not rated yet</LowerOpacity>
        )}{" "}
      </h5>
      <OutlinedButton
        loading={loading}
        className="mt-2"
        color={theme.colors.green}
        onClick={acceptRequest}
      >
        Accept
      </OutlinedButton>
    </RequestContainer>
  );
};

const Schema = yup.object().shape({
  problem: yup.string("Problem is required").required("Problem is required"),
  location: yup.string("Location is required"),
  carType: yup.string("Car type is required").required("Car type is required"),
  bid: yup.number("Bid is required").required("Bid is required"),
  requests: yup.array(),
});

const InputsContainer = styled.div`
  display: flex;
  column-gap: 20px;
`;

const Details = ({ order, orderLoading }) => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [isAppointment, setIsAppointment] = useState(false);
  const [destination, setDestination] = useState({
    name: "",
    lat: "",
    lng: "",
  });
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const openModal = () => {
    setModal(true);
  };
  const onCloseCalled = (latLng, name) => {
    setDestination({
      name,
      ...latLng,
    });
    setModal(false);
  };

  const closeHandler = () => {
    setVisible(false);
  };

  async function cancelOrder() {
    try {
      setLoading(true);
      await UserService.cancelOrder({ id: order.id });
      toast.success("Order canceled");
      push("/app/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const submit = (data) => {
    const payload = {
      ...data,
      location: destination.name || order.location,
      latLng: {
        lat: destination.lat || order.latLng.lat,
        lng: destination.lng || order.latLng.lng,
      },
      id: order.id,
    };
    try {
      UserService.updateOrder(payload);
      toast.success("Order Updated");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      closeHandler();
    }
  };

  return (
    <DetailsContainer>
      <OrderDetails>
        <h3>Order Details</h3>
        {orderLoading && <Loading />}
        <h5>
          Price:
          <LowerOpacity>
            {" "}
            {CommonUtility.currencyFormat(order.bid)}{" "}
          </LowerOpacity>
        </h5>
        <h5>
          Problem:
          <LowerOpacity>
            {" "}
            {skillsMap[order.problem] || order.problem}{" "}
          </LowerOpacity>
        </h5>
        <h5>
          Location:<LowerOpacity> {order.location} </LowerOpacity>
        </h5>
        <h5>
          Car Type:
          <LowerOpacity>
            {" "}
            {carTypesMap[order.carType] || order.carType}{" "}
          </LowerOpacity>
        </h5>
        {!!order.time && !!order.date ? (
          <div className="ml-1">
            <Text h4 className="mt-3">
              Appointment
            </Text>
            <h5 className="mt-1">
              Time:<LowerOpacity> {order.time} </LowerOpacity>
            </h5>
            <h5 className="mt-1">
              Date:<LowerOpacity> {order.date} </LowerOpacity>
            </h5>
          </div>
        ) : (
          <></>
        )}
        <br />
        <>
          <OutlinedButton
            className="mr-3"
            color={theme.colors.red}
            onClick={cancelOrder}
            loading={loading}
          >
            {" "}
            Cancel{" "}
          </OutlinedButton>
          <OutlinedButton
            color={theme.colors.blue}
            onClick={handler}
            loading={loading}
          >
            {" "}
            Update{" "}
          </OutlinedButton>
        </>
      </OrderDetails>
      <VendorRequestsContainer>
        <h3 className="mb-2">Bids</h3>
        <VendorRequests>
          {order.requests?.length > 0
            ? order.requests?.map((request) => (
                <Request request={request} id={order.id} />
              ))
            : "Bids Will Appear Here"}
        </VendorRequests>
      </VendorRequestsContainer>
      <Modal closeButton open={visible} onClose={closeHandler} width="450px">
        <Modal.Header>
          <Text size={18}>Update Order</Text>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(submit)}>
            <InputsContainer>
              <DropdownFormField
                control={control}
                hint={errors?.problem?.message}
                label={"Problem"}
                name="problem"
                width={"15vw"}
                placeholder={"Engine"}
                options={skillsOption}
                required
                defaultValue={order.problem}
              />
              <DropdownFormField
                control={control}
                hint={errors?.carType?.message}
                label={"Car Type"}
                name="carType"
                width={"15vw"}
                placeholder={"Sedan"}
                options={carTypeOptions}
                required
                defaultValue={order.carType}
              />
            </InputsContainer>
            <InputsContainer>
              <div>
                <LocationName>Location</LocationName>
                <StyledMuteButton
                  className="mb-3"
                  onClick={() => {
                    openModal();
                  }}
                  icon={<HouseLine size={20} />}
                >
                  {destination.name ? destination.name : "Select Destination"}
                </StyledMuteButton>
              </div>
              <InputFormField
                control={control}
                hint={errors?.bid?.message}
                label={"My Bid"}
                name="bid"
                placeholder={"--- PKR"}
                required
                defaultValue={order.bid}
              />
            </InputsContainer>
            <Checkbox
              isSelected={isAppointment}
              onChange={setIsAppointment}
              color="success"
            >
              <Text size={14}>Make an Appointment</Text>
            </Checkbox>
            {isAppointment && (
              <>
                <Text className="my-3">
                  Select suitable time and get appropriate bids
                </Text>
                <InputFormField
                  width="186px"
                  control={control}
                  hint={errors?.time?.message}
                  name="time"
                  label="Time"
                  type="time"
                  required
                  defaultValue={order.time}
                />
                <InputFormField
                  width="186px"
                  control={control}
                  hint={errors?.date?.message}
                  name="date"
                  label="Date"
                  type="date"
                  required
                  defaultValue={order.date}
                />
              </>
            )}
            <AddressPopup open={modal} onClose={onCloseCalled} />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <OutlinedButton
            color={theme.colors.blue}
            size={15}
            onClick={() => handleSubmit(submit)()}
          >
            Update Order
          </OutlinedButton>
          <OutlinedButton
            onClick={closeHandler}
            size={15}
            color={theme.colors.red}
          >
            Close
          </OutlinedButton>
        </Modal.Footer>
      </Modal>
    </DetailsContainer>
  );
};

export default function Order() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading } = orderUser(id);

  return (
    <Container>
      <Top>
        <CursorPointer onClick={() => router.push("/app/")}>
          <CaretLeft size={32} />
        </CursorPointer>
        <AppTitle name="Order" />
      </Top>
      <Details orderLoading={loading} order={data} />
    </Container>
  );
}
