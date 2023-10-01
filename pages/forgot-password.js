import { InputFormField } from "@elements/input";
import { SecondaryButton } from "@elements/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styled from "styled-components";
import UserService from "@utility/services/user";
import { useState } from "react";
import toast from "react-hot-toast";
import { SimpleNavbar } from "@page-components/landing/navbar";
import { Link } from "@nextui-org/react";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  width: 90%;
  max-width: 1200px;
  position: relative;
  z-index: 2;
  margin-top: 50px;
`;

const LoginHeading = styled.div`
  margin-top: 60px;
  width: max-content;
  h2 {
    color: white;
    font-weight: 700;
  }
`;

const InputFields = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  column-gap: 30px;
  h6 {
    color: white;
  }
  .nextui-input-helper-text-container p {
    color: white;
  }
`;

const RegButton = styled.div`
  display: flex;
  justify-content: center;
  button {
    width: 100%;
    color: black;
  }
  margin-top: 30px;
`;

const BackgroundContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-image: url(/images/login/white.jpeg);
  background-position: center;
  background-size: cover;
  padding-top: 80px;
  .overlay {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 1;
    height: 100%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.2));
  }
  .forgot{
    color: rgba(0,150,255);
  }
`;

const Schema = yup.object().shape({
  email: yup
    .string("Email is required")
    .email("Must be type email")
    .max(50)
    .required("Email is required"),
});

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const submit = async (data) => {
    setLoading(true);
    const payload = {
      email: data.email,
    };
    try {
      const res = await UserService.resetPassword(payload);
      if(res){
        toast.success("Password resetted, kindly check your e-mail");
      } else {
        toast.error("There was Issue resetting");
      }
    } catch (error) {
      toast.error("There was Issue resetting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SimpleNavbar />
      <BackgroundContainer>
        <div className="overlay" />
        <MainContainer>
          <LoginHeading>
            <h2>Forgot Password</h2>
          </LoginHeading>

          <form onSubmit={handleSubmit(submit)}>
            <InputFields>
              <InputFormField
                control={control}
                hint={errors?.name?.message}
                label={"Email"}
                name="email"
                style={{width: '220px'}}
                placeholder={"John Doe"}
              />
            </InputFields>
            <Link className="forgot" href="/login" >
              Back To Login
            </Link>

            <RegButton>
              <SecondaryButton
                loading={loading}
                type="submit"
              >
                Reset Password
              </SecondaryButton>
            </RegButton>
          </form>
        </MainContainer>
      </BackgroundContainer>
    </>
  );
}
