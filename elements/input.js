import { Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import styled from "styled-components";
import { Star } from "phosphor-react";
import { theme } from "@utility/theme";
import { User } from "phosphor-react";

const FieldContiner = styled.div`
  margin-bottom: 10px;
`;

const FlexColumnm = styled.div`
  display: flex;
  flex-direction: column;
`;

const CustomInput = styled(Input)`
  label {
    border-radius: 5px;
  }
  & + .nextui-input-helper-text-container p {
    margin-left: 2px;
    color: ${({ theme }) => theme.colors.red};
  }
  ${({ label }) => (label === 1 ? "" : "margin-top: 5px;")};
`;

const CustomPasswordInput = styled(Input.Password)`
  width: 237px;
  label {
    border-radius: 5px;
  }
  & + .nextui-input-helper-text-container p {
    margin-left: 2px;
    color: ${({ theme }) => theme.colors.red};
  }
  ${({ label }) => (label === 1 ? "" : "margin-top: 5px;")};
`;

const StarContainer = styled.div`
  width: max-content;
`;

export const SimpleInput = ({ label, placeholder, containerClass = '', ...rest }) => {
  return (
    <FlexColumnm className={containerClass} >
      {label && <h6>{label}</h6>}
      <CustomInput
        margin={label ? 1 : 0}
        placeholder={placeholder || label}
        clearable
        {...rest}
      />
    </FlexColumnm>
  );
};

const ImageLabel = styled.label`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

const ErrorMessage = styled.div`
  padding: 5px 10px;
  margin-left: 10px;
  background: ${({ theme }) => theme.colors.red};
  border-radius: 5px;
  color: white;
  height: min-content;
  opacity: ${({ noImageError }) => noImageError? "1":"0"};
  transition: 0.3s ease-in-out;
  transform: scale( ${({ noImageError }) => noImageError? "1":"0"} )
`

export const InputImageSimple = ({
  value = null ,
  className,
  noImageError,
  ...rest
}) => {
  
  return (
    <div className="position-relative d-flex align-items-center" >
      <ImageLabel
        style={{ cursor: "pointer" }}
        for="imageInput"
        className={className}
      >
        {value ? (
          <ImageContainer url={URL.createObjectURL(value)} />
        ) : (
          <User size={32} />
        )}
      </ImageLabel>
      <ErrorMessage noImageError={noImageError} >
        Image is required
      </ErrorMessage>
      <input
        id="imageInput"
        style={{ display: "none" }}
        type="file"
        accept="image/*"
        {...rest}
      />
    </div>
  );
};

export const PasswordInput = ({ label, placeholder, containerClass = '', ...rest }) => {
  return (
    <FlexColumnm className={containerClass} >
      {label && <h6>{label}</h6>}
      <CustomPasswordInput
        margin={label ? 1 : 0}
        placeholder={placeholder || label}
        clearable
        {...rest}
      />
    </FlexColumnm>
  );
};

export const InputFormField = ({
  control,
  name,
  defaultValue,
  required,
  error,
  label,
  hint,
  placeholder,
  ...rest
}) => {
  return (
    <FieldContiner>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({
          field: { onChange, value, ref },
          fieldState: { error },
        }) => (
          <>
            {label && <h6>{label}</h6>}
            <CustomInput
              inputRef={ref}
              margin={label ? 1 : 0}
              required={required}
              placeholder={placeholder || label}
              clearable
              value={value}
              onChange={(e) => onChange(e.target.value)}
              helperText={hint}
              status={error ? "error" : "default"}
              {...rest}
            />
          </>
        )}
      />
    </FieldContiner>
  );
};

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${({ url }) => url});
  background-position: center;
  background-size: cover;
`;

const Error = styled.span`
  float: right;
  color: ${({ theme }) => theme.colors.red};
  font-size: 10px;
`

export const InputImage = ({
  control,
  name,
  defaultValue,
  required,
  error,
  label,
  hint,
  placeholder,
  ...rest
}) => {
  return (
    <FieldContiner>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({
          field: { onChange, value, ref },
        }) => (
          <>
            <ImageLabel
              style={{ cursor: "pointer" }}
              for="imageInput"
              {...rest}
            >
              {value ? (
                <ImageContainer url={URL.createObjectURL(value)}/>
              ) : (
                <User size={32} />
              )}
            </ImageLabel>
            <input
              id="imageInput"
              style={{ display: "none" }}
              type="file"
              required={required}
              inputRef={ref}
              accept="image/*"
              onChange={(e) => {onChange(e.target.files[0]); console.log('org: ', e.target.files)}}
            />
            {hint && <Error>{hint}</Error>}
          </>
        )}
      />
    </FieldContiner>
  );
};

export const PasswordFormField = ({
  control,
  name,
  defaultValue,
  required,
  error,
  label,
  hint,
  placeholder,
  ...rest
}) => {
  return (
    <FieldContiner>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({
          field: { onChange, value, ref },
          fieldState: { error },
        }) => (
          <>
            {label && <h6>{label}</h6>}
            <CustomPasswordInput
              inputRef={ref}
              margin={label ? 1 : 0}
              required={required}
              placeholder={placeholder || label}
              clearable
              value={value}
              onChange={(e) => onChange(e.target.value)}
              helperText={hint}
              status={error ? "error" : "default"}
              {...rest}
            />
          </>
        )}
      />
    </FieldContiner>
  );
};

export const RatingStar = ({ rating, setRating = () => {}, hover = true }) => {
  return (
    <StarContainer>
      <Star
        size={22}
        weight="fill"
        style={{
          cursor: hover ? "pointer" : "default",
          color: rating >= 1 ? theme.colors.yellow : theme.colors.halfBlack,
        }}
        onMouseEnter={() => setRating(1)}
      />
      <Star
        size={22}
        weight="fill"
        style={{
          cursor: hover ? "pointer" : "default",
          color: rating >= 2 ? theme.colors.yellow : theme.colors.halfBlack,
        }}
        onMouseEnter={() => setRating(2)}
      />
      <Star
        size={22}
        weight="fill"
        style={{
          cursor: hover ? "pointer" : "default",
          color: rating >= 3 ? theme.colors.yellow : theme.colors.halfBlack,
        }}
        onMouseEnter={() => setRating(3)}
      />
      <Star
        size={22}
        weight="fill"
        style={{
          cursor: hover ? "pointer" : "default",
          color: rating >= 4 ? theme.colors.yellow : theme.colors.halfBlack,
        }}
        onMouseEnter={() => setRating(4)}
      />
      <Star
        size={22}
        weight="fill"
        style={{
          cursor: hover ? "pointer" : "default",
          color: rating >= 5 ? theme.colors.yellow : theme.colors.halfBlack,
        }}
        onMouseEnter={() => setRating(5)}
      />
    </StarContainer>
  );
};