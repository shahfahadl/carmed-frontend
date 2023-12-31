import { SecondaryButton } from "@elements/button";
import { MapPin, SignIn } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import VendorService from "@utility/services/vendor";
import { useAuth } from "@contexts/auth";
import { useRouter } from "next/router";
import AddressPopup from "@elements/Google/addressSelector";
import { skillsOption } from "@utility/constants/common";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputFormField, InputImage, PasswordFormField } from "@elements/input";
import { DropdownFormField } from "@elements/dropdown";
import UploadMediaService from "@utility/services/upload-service";
import axios from "axios";
import { SimpleNavbar } from "@page-components/landing/navbar";
import { toast } from "react-hot-toast";
import UserService from "@utility/services/user";

const Main = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  padding-top: 100px;
  justify-content: center;
  background-image: url(/images/login/vendor.jpg);
  background-size: cover;
  background-position: center;
  .white-overlay {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: linear-gradient(
      90deg,
      rgba(150, 150, 150, 1),
      rgba(150, 150, 150, 0.5),
      rgba(255, 255, 255, 0)
    );
  }
`;

const BodyContainer = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  margin-left: 100px;
  padding-top: 30px;
`;

const Form = styled.form`
  display: flex;
  margin-top: 30px;
  flex-direction: column;
  max-width: fit-content;
`;

const Headings = styled.div`
  display: flex;
  flex-direction: column;
`;

const Exposure = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 30px;
`;

const NewAccount = styled.div`
  display: flex;
  font-weight: 900;
  font-size: 40px;
  padding-top: 15px;
`;

const Dot = styled.div`
  color: ${({ theme }) => theme.colors.yellow};
`;

const Member = styled.div`
  display: flex;
  padding-top: 15px;
  font-weight: 600;
  font-size: 20px;
  a {
    color: ${({ theme }) => theme.colors.yellow};
    margin-left: 3px;
  }
`;

const Yellow = styled.div`
  margin: 0px 10px 0px 10px;
  color: ${({ theme }) => theme.colors.yellow};
`;

const RegButton = styled.div`
  position: relative;
  button {
    color: black;
    font-weight: 800;
  }
`;

const Error = styled.span`
  position: absolute;
  bottom: -15px;
  color: ${({ theme }) => theme.colors.red};
  font-size: 10px;
`;

const ColumnGap = styled.div`
  display: flex;
  column-gap: 30px;
`;

const Schema = yup.object().shape({
  name: yup
    .string()
    .required("name is required")
    .matches(/^[a-zA-Z\s]+$/, "Name must contain alphabets only")
    .max(50),
  cnic: yup
    .string()
    .typeError("CNIC must be valid")
    .required("CNIC is required")
    .length(13, "CNIC must be exactly 13 digits")
    .test(
      "is-number",
      "CNIC must be a valid 13-digit number",
      (value) => !isNaN(Number(value))
    ),
  contact: yup
    .string()
    .typeError("Contact must be valid")
    .required("CNIC is required")
    .min(11)
    .max(14)
    .matches(/^[\d+\s]+$/, "Contact must be valid"),
  email: yup
    .string()
    .email("must be an email")
    .required("email is required")
    .max(50),
  password: yup.string().required("password is required").max(50),
  gender: yup.string().required("Gender is required"),
  otp: yup.string("OTP is required").required("OTP is required"),
  skill: yup.string().required("skill is required"),
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileType", "Unsupported File Format", (value) => {
      if (value) {
        return ["image/jpeg", "image/png"].includes(value.type);
      }
      return true;
    }),
});

const RegisterButton = styled(SecondaryButton)`
  color: black !important;
  font-weight: bold;
`;

export default function vendorSignup() {
  const [loading, setLoading] = useState(false);
  const [noOriginError, setNoOriginError] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [onceClicked, setOnceClicked] = useState(false)
  const { login } = useAuth();

  const [mapOpen, setMapOpen] = useState(false);
  const [origin, setOrigin] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    getFieldState,
    watch
  } = useForm({
    resolver: yupResolver(Schema),
    mode: "all"
  });

  const { push } = useRouter();

  const options = skillsOption;

  const genderOptions = [
    { text: "Male", value: "male" },
    { text: "Female", value: "female" },
  ];

  const submit = async (data) => {
    if (origin) {
      setLoading(true);
      const avatar = data.image;
      const fileObject = {
        name: avatar.name,
        type: avatar.type,
      };
      const url = await UploadMediaService.getSignedUrl(fileObject);
      await axios.put(url, avatar);
      const imageUrl = url.split("?")[0];

      const payload = {};
      payload.profile = imageUrl;
      payload.name = data.name;
      payload.contact = data.contact;
      payload.email = data.email;
      payload.password = data.password;
      payload.cnic = data.cnic;
      payload.skill = data.skill;
      payload.gender = data.gender;
      payload.city = origin.name;
      payload.lat = origin.lat;
      payload.lng = origin.lng;

      try {
        const res = await VendorService.add(payload);
        if (res.token) {
          VendorService.storeVendor(res);
          login();
          push("/app/vendor");
        }
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setLoading(false);
      }
    } else {
      setNoOriginError(true);
    }
  };

  const onCloseCalled = (latLng, name) => {
    if(name){
      setOrigin({
        name,
        ...latLng,
      });
    }
    setMapOpen(false);
    setNoOriginError(false);
  };

  const {error: emailError} = getFieldState('email');
  const email = watch('email');
  
  const intervalRef = useRef();
  
  const showOTP = email && !emailError;

  const generateOTP = async () => {
    setOnceClicked(true);
    try {
      await UserService.generateOTP({email})
      setSubmitCount(prev => prev + 1);
      setSeconds(60);
    } catch (error) {
      toast.error("There was error generating OTP")
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    intervalRef.current = timer;
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [submitCount]);

  useEffect(() => {
    if (seconds < 1) {
      clearInterval(intervalRef.current);
    }
  }, [seconds]);

  return (
    <>
      <SimpleNavbar />
      <Main>
        <div className="white-overlay"></div>
        <BodyContainer>
          <Headings>
            <Exposure>
              Giving <Yellow>Exposure</Yellow> to your skills.
            </Exposure>
            <NewAccount>
              Create new account<Dot>.</Dot>
            </NewAccount>
            <Member>
              Already have an Account?
              <a href="/login">
                <u>Login</u>
              </a>
            </Member>
          </Headings>

          <Form onSubmit={handleSubmit(submit)}>
            <ColumnGap>
              <InputFormField
                control={control}
                hint={errors?.name?.message}
                label={"Full Name"}
                name="name"
                placeholder={"John Doe"}
              />
              <InputImage
                className="ml-1"
                control={control}
                name="image"
                hint={errors?.image?.message}
              />
            </ColumnGap>
            <ColumnGap>
              <InputFormField
                control={control}
                hint={errors?.email?.message}
                label={"Email"}
                name="email"
                placeholder={"someone@gmail.com"}
              />
              <InputFormField
                control={control}
                hint={errors?.cnic?.message}
                label={"CNIC"}
                name="cnic"
                style={{ width: "215px" }}
                placeholder={"CNIC: ----- / ------- / -"}
              />
            </ColumnGap>
            {showOTP && <RegisterButton className='mb-2' disabled={seconds !== 0} onClick={() => generateOTP()} >{seconds > 0? `Retry in ${seconds}s` : "Send OTP"}</RegisterButton> }
              {onceClicked && 
                <div className="d-flex align-items-center mt-2 ">
                    <InputFormField
                      control={control}
                      hint={errors?.otp?.message}
                      label={"OTP"}
                      name="otp"
                      style={{ width: "215px" }}
                      placeholder={"XXXXXX"}
                    />
                </div>
              }
            <ColumnGap>
              <InputFormField
                control={control}
                hint={errors?.contact?.message}
                label={"Contact"}
                name="contact"
                placeholder={"+92 --- -------"}
              />
              <PasswordFormField
                label={"Password"}
                type={"password"}
                placeholder={"Password"}
                name="password"
                hint={errors?.password?.message}
                control={control}
              />
            </ColumnGap>
            <ColumnGap className="mt-2">
              <DropdownFormField
                placeholder={"Select Your Skill"}
                label={"Skill"}
                name="skill"
                control={control}
                options={options}
                hint={errors?.skill?.message}
              />
              <DropdownFormField
                placeholder={"Select Gender"}
                label={"Gender"}
                name="gender"
                control={control}
                options={genderOptions}
                hint={errors?.gender?.message}
              />
            </ColumnGap>
            <RegButton className="">
              <SecondaryButton
                onClick={() => setMapOpen(true)}
                icon={<MapPin size={20} />}
              >
                {origin ? origin.name : "Select Your Location"}
              </SecondaryButton>
              {noOriginError && <Error>Origin Is Required</Error>}
            </RegButton>
            <RegButton className="mt-4">
              <SecondaryButton
                type={"submit"}
                loading={loading}
                icon={<SignIn size={20} weight="bold" color="black" />}
              >
                CreateAccount
              </SecondaryButton>
            </RegButton>
            <AddressPopup open={mapOpen} onClose={onCloseCalled} />
          </Form>
        </BodyContainer>
      </Main>
    </>
  );
}
