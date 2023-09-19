import { Checkbox, Radio } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import styled from "styled-components";
import { CommonUtility } from "@utility/common";
import { User } from "phosphor-react";

const Hint = styled.p`
    font-size: 0.625rem;
    margin-left: 2px;
    color: ${({theme}) => theme.colors.red};
`

export const FieldCheckbox = ({
    control, name, defaultValue, required, error, label, hint, placeholder, ...rest
}) => {
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            render={({
                field: { onChange, value, ref },
                fieldState: { error },
            }) => (<>
                {label && <h6>{label}</h6>}
                <Checkbox
                    color="success"
                    inputRef={ref}
                    margin={label ? 1 : 0}
                    required={required}
                    placeholder={placeholder || label}
                    clearable
                    value={value}
                    onChange={onChange}
                    status={error ? "error" : 'default'}
                    {...rest}
                />
                {hint && <Hint>{hint}</Hint>}
            </>
            )}
        />
    )
}

const StyledRadio = styled(Radio)`
    margin-top: 0 !important;
`

const TitleContainer = styled.div`
    position: relative;
    h2 {
      font-weight: 400;
    }
    h2:nth-child(2) {
      position: absolute;
    }
    div {
      position: absolute;
      width: 70%;
      height: 10px;
      background-color: ${({theme}) =>theme.colors.yellow};
      border-radius: 10px;
      right: -10%;
      bottom: 10px;
      opacity: 0.4;
    }
    margin: 20px;
    margin-bottom: 30px;
`

export const RadioFormField = ({
    required, options, label, hint, control, name, defaultValue, ...rest
  }) => {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({
            field: { onChange, value },
            fieldState: { error },
        }) => (<>
          <Radio.Group
              onChange={(e) => onChange(e)}
              value={value}
          >
              {options.map((item) => (
                <StyledRadio
                  key={item.value}
                  value={item.value}
                  labelColor={error && "error"}
                  size="sm"
                  name={name}
                  isDisabled={item.disabled}
                  {...rest}
                >
                    {item.text}
                </StyledRadio>
              ))}
          </Radio.Group>
            {hint && <Hint>{hint}</Hint>}
        </>
        )}
      />
    )
  }

export const AppTitle = ({name}) =>{
    return (<TitleContainer>
        <div></div>
        <h2>
          {name}
        </h2>
        <h2>
          {name}
        </h2>
    </TitleContainer>)
}

const ProfileImageContainer = styled.div`
  width: 60px;
  height: 60px;
  border: 2px solid white;
  margin: 30px;
  margin-left: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  over-flow: hidden;
`;

const ProfileContainer = styled.div`
  margin-left: -50px;
  display: flex;
  align-items: center;
  text-transform: capitalize;
  span {
    cursor: pointer;
  }
  p {
    opacity: 0.6;
    font-size: 14px;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

export const Profile = ({ profileImage, username, type}) => {
  const url = profileImage
  return (
    <ProfileContainer>
      <ProfileImageContainer>
        {profileImage ? <ProfileImage src={url} /> : <User size={32} />}
      </ProfileImageContainer>
      <span>
        {username}
        <p>{type}</p>
      </span>
    </ProfileContainer>
  );
};

export const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`