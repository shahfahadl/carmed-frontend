import { useAuth } from "@contexts/auth"
import { MuteButton, OutlinedButton } from "@elements/button"
import { DropdownFormField } from "@elements/dropdown"
import AddressPopup from "@elements/Google/addressSelector"
import { InputFormField, SimpleInput } from "@elements/input"
import { yupResolver } from "@hookform/resolvers/yup"
import { Checkbox, Modal, Text } from "@nextui-org/react"
import { carTypeOptions, skillsOption } from "@utility/constants/common"
import { theme } from "@utility/theme"
import { HouseLine } from "phosphor-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import styled from "styled-components"
import * as yup from 'yup';
import UserService from '@utility/services/user';
import toast from 'react-hot-toast';

const StyledMuteButton = styled(MuteButton)`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-content: start;
`

const LocationName = styled.div`
  font-size: 15px;
  margin-bottom: 5px;
  font-weight: 600;
`

const InputsContainer = styled.div`
  display: flex;
  column-gap: 20px;
`

const Schema = yup.object().shape({
  problem: yup.string("Problem is required").required("Problem is required"),
  time: yup.string("Time is required").when("$isAppointment", (isAppointment, schema) => (isAppointment ? schema.required("Time is required") : schema.optional())),
  date: yup.string("Date is required").when("$isAppointment", (isAppointment, schema) => (isAppointment ? schema.required("Date is required") : schema.optional())),
  carType: yup.string("Car type is required").required("Car type is required"),
  bid: yup.number("Bid is required").required("Bid is required")
});

export const OrderNowPopup = ({ open, onClose }) => {

  const [isAppointment, setIsAppointment] = useState(false);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(Schema),
    context: {
      isAppointment,
    },
  });

  const [destination, setDestination] = useState({
    name: '',
    lat: '',
    lng: ''
  })

  const openModal = () => {
    setModal(true);
  }

  const onCloseCalled = (latLng, name) => {
    setDestination({
      name,
      ...latLng
    })
    setModal(false);
  }

  const submit = async (data) => {
    if(destination.name !== "" ){
      const payload = {
        ...data,
        location: destination.name,
        userId: user.id,
        userName: user.name,
        userProfile: user.profile,
        latLng: {
          lat: destination.lat,
          lng: destination.lng
        },
        requests: []
      }
      try {
        setLoading(true)
        await UserService.order(payload);
        toast.success("Order Placed")
      } catch (error) {
        toast.error("Invalid credentials")
      } finally {
        setLoading(false)
        reset({})
        onClose()
      }
    }else{
      toast.error("Location is Required")
    }
  }

  return (<>
    <Modal
      closeButton
      open={open}
      onClose={onClose}
      width="500px"
    >
      <Modal.Header>
        <Text size={22} b>
          Order Now
        </Text>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(submit)}>
          <InputsContainer >
            <DropdownFormField
              control={control}
              hint={errors?.problem?.message}
              label={'Problem'}
              name="problem"
              placeholder={'Engine'}
              options={skillsOption}
              required
            />
            <DropdownFormField
              control={control}
              hint={errors?.carType?.message}
              label={'Car Type'}
              name="carType"
              placeholder={'Sedan'}
              options={carTypeOptions}
              required
            />
          </InputsContainer>
          <InputsContainer>
            <div>
              <LocationName>
                Location
              </LocationName>
              <StyledMuteButton
                className="mb-3"
                onClick={() => {
                  openModal()
                }}
                icon={<HouseLine size={20} />}
              >
                {destination?.name ? destination.name : "Select Your Location"}
              </StyledMuteButton>
            </div>
            <InputFormField
              control={control}
              hint={errors?.bid?.message}
              label={'My Bid'}
              name="bid"
              placeholder={'PKR'}
              type="number"
              required
            />
          </InputsContainer>
          <Checkbox isSelected={isAppointment} onChange={setIsAppointment} color="success">
            <Text size={14} >Make an Appointment</Text>
          </Checkbox>
          {isAppointment && <>
            <Text className="my-3" >Select suitable time and get appropriate bids</Text>
            <InputFormField
              width="186px"
              control={control}
              hint={errors?.time?.message}
              name='time'
              label="Time"
              type="time"
              required
            />
            <InputFormField
              width="186px"
              control={control}
              hint={errors?.date?.message}
              name='date'
              label="Date"
              type="date"
              required
            />
          </>}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <OutlinedButton color={theme.colors.green} size={15} onClick={() => handleSubmit(submit)()} loading={loading}>
          Place Order
        </OutlinedButton>
        <OutlinedButton onClick={onClose} size={15} color={theme.colors.red} >
          Close
        </OutlinedButton>
      </Modal.Footer>
    </Modal>
    <AddressPopup
      open={modal}
      onClose={onCloseCalled}
    />
  </>
  )
}