import { SignIn } from "phosphor-react";
import { InputFormField, PasswordFormField } from "@elements/input";
import { SecondaryButton } from "@elements/button";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from "styled-components";
import UserService from "@utility/services/user";
import { useState } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/router";
import { useAuth } from "@contexts/auth";
import { RadioFormField } from "@elements/common";
import VendorService from "@utility/services/vendor";

const MainContainer = styled.div`
    color: white;
    width: 90%;
    max-width: 1200px;
    position: relative;
    z-index: 2;
    margin-top: 50px;
`
const Slogan = styled.div`
    display: flex;
    flex-wrap: wrap;
    font-weight: bold;
    span{
        display: flex;
        font-size: 35px;
    }
`
const Yellow = styled.span`
    color: ${({ theme }) => theme.colors.yellow};
    min-width: max-content;
`
const LoginHeading = styled.div`
    margin-top: 60px;
    width: max-content;
    h2{
        color: white;
        font-weight: 700;
    }
`
const AttemptSignin = styled.div`
    display: flex;
    color: white;
    a{
        color: ${({ theme }) => theme.colors.yellow};
    }
    span{
        font-size: 16px;
        display: flex;
        font-weight: 600;
    }
`
const InputFields = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    column-gap: 30px;
    h6{
        color: white;
    }
    .nextui-input-helper-text-container p{
        color: white;
    }
`

const RadioSelector = styled(RadioFormField)`
    width: max-content;
    .nextui-radio-container span{
        color: white;
    }
`

const RegButton = styled.div`
    button{
        color: black;
    }
    margin-top: 30px;
`

const BackgroundContainer = styled.div`
    width: 100vw;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    background-image: url( /images/login/interior.jpg );
    background-position: center;
    background-size: cover;
    .overlay{
        width: 100%;
        position: absolute;
        top: 0;
        z-index: 1;
        height: 100%;
        background: linear-gradient(90deg, rgba(0,0,0,1), rgba(0,0,0,0.2));
    }
`

const Schema = yup.object().shape({
    email: yup.string("Email is required").email("Must be type email").max(50).required("Email is required"),
    password: yup.string("Password is required").max(50).required("Password is required"),
    role: yup.string("Role is required").required("Role is required").default('user'),
});

export default function Login() {

    const [loading, setLoading] = useState(false);

    const { login} = useAuth()

    const {
        push
    } = useRouter();

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(Schema),
    });

    const submit = async (data) => {
        setLoading(true);
        const payload = {
            email: data.email,
            password: data.password
        }
        try {
            let res = {};
            if(data.role === 'vendor'){
                res = await VendorService.login(payload);
            } else {
                res = await UserService.login(payload);
            }
            UserService.storeUser(res);
            if (res.token) {
                login()
                push('/app')
            }
        } catch (error) {
            toast.error("Invalid credentials")
        } finally {
            setLoading(false)
        }
    }

    const radioOptions = [
        { value: "user", text: "User" },
        { value: "vendor", text: "Vendor" },
    ]

    return (
        <BackgroundContainer>
          <div className="overlay" />
            <MainContainer>
                <Slogan>
                    <Yellow>CarMed Vehicle Services</Yellow><span>&nbsp;Variety of Services at your&nbsp;</span><Yellow>Doorstep</Yellow>
                </Slogan>
                <LoginHeading>
                    <h2>Log In</h2>
                </LoginHeading>
                <AttemptSignin>
                    <span>Not a member?<Yellow>&nbsp;<a href="/signup"><u>Register Now</u></a></Yellow></span>
                </AttemptSignin>

                <form onSubmit={handleSubmit(submit)}>
                    <InputFields>
                        <InputFormField
                            control={control}
                            hint={errors?.name?.message}
                            label={'Email'}
                            name="email"
                            width={'15vw'}
                            placeholder={'John Doe'}
                        />
                        <PasswordFormField
                            label={'Password'}
                            type={'password'}
                            placeholder={'Password'}
                            name="password"
                            hint={errors?.password?.message}
                            control={control}
                        />
                    </InputFields>
                    <RadioSelector
                        name="role"
                        control={control}
                        options={radioOptions}
                        hint={errors?.role?.message}
                        defaultValue="user"
                    />

                    <RegButton>
                        <SecondaryButton loading={loading} type='submit' icon={<SignIn size={20} weight="bold" color="black" />}>Login</SecondaryButton>
                    </RegButton>
                </form>


            </MainContainer>
        </BackgroundContainer>

    )
}