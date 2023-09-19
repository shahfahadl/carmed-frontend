import { useEffect, useState } from "react";
import styled from "styled-components"
import { InputFormField, PasswordFormField, InputImage } from "@elements/input";
import { DropdownFormField } from "@elements/dropdown";
import { SignIn } from "phosphor-react";
import { SecondaryButton } from "@elements/button";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import UserService from "@utility/services/user";
import { useAuth } from "@contexts/auth";
import { useRouter } from "next/router";
import UploadMediaService from "@utility/services/upload-service";
import axios from "axios";

const MainContainer = styled.div`
    width: 95%;
    max-width: 1400px;
    position: relative;
    z-index: 2;
    margin-top: 50px;
`

const Headings = styled.div`
    margin-bottom: 60px;
    h2, h1{
        color: white;
    }
`
const Dirty = styled.div`
    display: flex;
    padding-bottom: 10px;
    align-items: center;
    span{
        font-size: 40px;
    }
`

const Yellow = styled.span`
    color: ${({ theme }) => theme.colors.yellow};
    font-size: 35px;
    font-weight: 900;
    margin-left: 10px;
`
const CreateAccount = styled.div`
    display: flex;
    align-items: center;
    h1{
        display: flex;
        font-weight: 800;
        align-items: end;

    }
    .dot{
        width: 12px;
        height: 12px;
        margin-bottom: 18px;
        border-radius: 50%;
        background-color:${({ theme }) => theme.colors.yellow};
    }
`

const Member = styled.div`
    display: flex;
    margin-top: 10px;
    align-items: center;
    a{
        color: ${({ theme }) => theme.colors.yellow};
    }
    h2{
        display: flex;
        font-weight: 600;
        align-items: center;
    }
    u{
        font-weight: 800;
    }
`

const NameGender = styled.div`
    display: flex;
    column-gap: 20px;
    margin-top: 20px;
    button{
        color: white;
        border-color: white;
    }
`

const EmailPassword = styled.div`
    margin-bottom: 10px;

    InputField{
        margin-top:5px;
    `
const Email = styled.div`
    margin-bottom: 10px;
`
const Password = styled.div`
    display: flex;
    column-gap: 20px;
`
const RegisterButton = styled(SecondaryButton)`
    margin-top: 60px;
    color: black;
    font-weight: bold;
`

const BackgroundContainer = styled.div`
    width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    .bg{
        position: absolute;
        top: 0;
        transform: scaleX(-1);
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
    h6{
        color: white;
    }
`

const Schema = yup.object().shape({
  name: yup.string("Name is required")
    .required("name is required")
    .matches(/^[A-Za-z]+$/, "Name must contain alphabets only")
    .max(50),
  cnic: yup.string()
    .typeError("CNIC must be valid")
    .required("CNIC is required")
    .length(13, "CNIC must be exactly 13 digits")
    .test("is-number", "CNIC must be a valid 13-digit number", (value) => !isNaN(Number(value))),
  email: yup.string()
    .email("must be an email")
    .required("email is required")
    .max(50),
  password: yup.string("Email is required")
    .required("password is required")
    .max(50),
  gender: yup.string("Gender is required").required("Gender is required"),
  image: yup.mixed().test("fileType", "Unsupported File Format", (value) => {
    if (value) {
      return ["image/jpeg", "image/png"].includes(value.type);
    }
    return true;
  }),
});

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const {
    push
  } = useRouter();

  const options = [
    { text: "Male", value: 'male' },
    { text: "Female", value: 'female' }
  ];

  const submit = async (data) => {

    const payload = {
      ...data
    };
    delete payload.image;
    setLoading(true);
    
    try {
      if (data.image) {
        const avatar = data.image;
        const fileObject = {
          name: avatar.name,
          type: avatar.type
        }
        const url = await UploadMediaService.getSignedUrl(fileObject);
        await axios.put(url, avatar);
        const imageUrl = url.split('?')[0];
        payload.profile = imageUrl;
      }else{
        payload.profile = "";
      }

      const res = await UserService.add(payload);
      if (res.token) {
        UserService.storeUser(res);
        login();
        push('/app')
      }
    } catch (error) {
      console.log("error: ", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BackgroundContainer>
      <img className="bg" src="/images/login/exterior.jpg" />
      <MainContainer>
        <Headings>
          <Dirty>
            <h2>Don't get caught riding</h2><Yellow>Dirty</Yellow>
          </Dirty>
          <CreateAccount>
            <h1>Create a new account<Yellow className="dot"></Yellow></h1>
          </CreateAccount>
          <Member>
            <h2>Already a member?<Yellow><u><a href="/login">Log In</a></u></Yellow></h2>
          </Member>
        </Headings>

        <form onSubmit={handleSubmit(submit)}>
          <NameGender>
            <Email>
              <InputFormField
                control={control}
                hint={errors?.name?.message}
                label={'Full Name'}
                name="name"
                placeholder={'John Doe'}
              />
            </Email>

            <DropdownFormField
              placeholder={"Select Gender"}
              label={'Gender'}
              name='gender'
              control={control}
              options={options}
              hint={errors?.gender?.message}
            />
          </NameGender>
          <EmailPassword>
            <div className="d-flex align-items-center">
              <Email>
                <InputFormField
                  control={control}
                  hint={errors?.email?.message}
                  label={'Email'}
                  name="email"
                  placeholder={'someone@gmail.com'}
                />
              </Email>
              <InputImage
                className="ml-5"
                control={control}
                name="image"
              />
            </div>
            <Password className="pt-2" >
              <PasswordFormField
                label={'Password'}
                type={'password'}
                placeholder={'Password'}
                name="password"
                hint={errors?.password?.message}
                control={control}
              />
              <InputFormField
                control={control}
                hint={errors?.cnic?.message}
                label={'CNIC'}
                name="cnic"
                placeholder={'CNIC: ----- / ------- / -'}
              />
            </Password>
          </EmailPassword>
          <RegisterButton loading={loading} type='submit' ><SignIn size={20} weight="bold" color="black" />&nbsp;CreateAccount</RegisterButton>
        </form>
      </MainContainer>
    </BackgroundContainer>

  )
}
