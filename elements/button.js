import { Button, Loading } from "@nextui-org/react";
import styled from "styled-components";
import { theme } from "@utility/theme";
import { cloneElement, isValidElement } from "react";

const DarkColoredButton = styled(Button)`
    background-color: ${({ color }) => color};
    color: white;
    width: fit-content;
    min-width: unset;
    border-radius: 5px;
    position: relative;
`

const LightColoredButton = styled(Button)`
    background-color: ${({ color }) => color};
    width: fit-content;
    min-width: unset;
    border-radius: 5px;
`

const LoadingRenderer = styled(Loading)`
    position: absolute;
    left; 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`

const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    jusitfy-content: center;
    ${({hide}) => hide === 1? `
        opacity: 0;
        pointer-events: none;
    `: ""}
`

const OutlineButtonContainer = styled.button`
    cursor: pointer;
    color: ${({color}) => color };
    border: 3px solid ${({color}) => color };
    padding: 0px 10px;
    border-radius: 8px;
    transition: 0.3s ease-in-out;
    font-weight: 600;
    ${({size}) => size && `font-size: ${size}px ;` }
    background-color: rgba(37, 150, 190,0);
    :hover {
        color: white;
        background-color: ${({color}) => color };
    }
    ${({hide}) => hide === 1? `
        pointer-events: none;
    `: ""}
`

const StyledButton = ({ icon, children, color, loading, ...rest }) => (
    <DarkColoredButton disabled={loading} color={color} {...rest}>
        {loading && <LoadingRenderer type="points-opacity" color="currentColor" size="sm" />}
        <ButtonContainer hide={loading? 1 : 0} >
            {isValidElement(icon) && cloneElement(icon, {
                style: {
                    width: '17px',
                    height: '17px',
                    marginRight: '5px'
                }
            })}
            {children}
        </ButtonContainer>
    </DarkColoredButton>
)

export const SuccessButton = ({ icon, children, ...rest }) => (
    <StyledButton icon={icon} children={children} color={theme.colors.green} {...rest} />
)

export const PrimaryButton = ({ icon, children, ...rest }) => (
    <StyledButton icon={icon} children={children} color={theme.colors.darkPurple} {...rest} />
)

export const SecondaryButton = ({ icon, children, ...rest }) => (
    <StyledButton icon={icon} children={children} color={theme.colors.yellow} {...rest} />
)

export const MuteButton = ({ icon, children, loading, ...rest }) => (
    <LightColoredButton disabled={loading} color={theme.colors.box} {...rest} >
        {loading && <LoadingRenderer type="points-opacity" color="currentColor" size="sm" />}
        <ButtonContainer hide={loading? 1 : 0} >
            {isValidElement(icon) && cloneElement(icon, {
                style: {
                    width: '17px',
                    height: '17px',
                    marginRight: '5px'
                }
            })}
            {children}
        </ButtonContainer>
    </LightColoredButton>
)

export const DangerButton = ({ icon, children, ...rest }) => (
    <StyledButton icon={icon} children={children} color={theme.colors.red} {...rest} />
)

export const OutlinedButton = ({children, loading , ...rest }) =>{
    return (<OutlineButtonContainer hide={loading? 1 : 0} {...rest} >
        {loading && <Loading size="sm" type="points-opacity" />}
        {!loading && children}
    </OutlineButtonContainer>)
}