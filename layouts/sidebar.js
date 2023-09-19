import { useAuth } from "@contexts/auth"
import { OutlinedButton } from "@elements/button";
import { useRouter } from "next/router";
import styled from "styled-components";
import { ListDashes,CaretRight,PlayCircle,Cardholder,User,BatteryCharging  } from "phosphor-react";
import { theme } from '@utility/theme'
import { Profile } from "@elements/common";
import { cloneElement, isValidElement, useMemo } from "react";

const LogoutButton = styled(OutlinedButton)`
    width: 83%;
`

const SidebarContainer = styled.div`
    padding-top: 20px;
    color: white;
    background: ${({ theme }) => theme.colors.darkPurple};
    h3{
        color: white;
    }
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 280px;
    display: flex;
    flex-direction: column;
    align-items:center ;
    button{
        align-self: end;
    }
`

const InformationCard = styled.div`
    padding: 15px;
`

const SideButtonContainer = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: space-between;\
    align-items: center;
    padding: 10px 15px;
    border-radius: 10px;
    width: 250px;
    font-weight: 500;
    background-color: ${({selected,theme}) => selected? theme.colors.yellow: "" };
    margin: 20px 0;
    transition: 0.3s ease-in-out;
    :hover {
        background-color: ${({theme,selected}) => selected? "":theme.colors.yellowLight};
    }
`
const CenterEverything = styled.div`
    display: flex;
    align-items: center;
`

const CustomButton = ({children,selected,fun}) =>{
    return (
    <SideButtonContainer selected={selected} onClick={()=>fun()}>
        <CenterEverything>
            {children}
        </CenterEverything>
        <CaretRight />
    </SideButtonContainer>
    )
}

export const Sidebar = () => {

    const {
        pathname,
        push
    } = useRouter();

    const { isAuthenticated, logout, isVendor, user } = useAuth();

    const menus = useMemo(() => {
        if(isVendor){
            return [
                {name: 'Available Orders', url: '/app/vendor', icon: <ListDashes size={20} className="mr-2" />},
                {name: 'In-Process Orders', url: '/app/vendor/inProcessOrders', icon: <PlayCircle className="mr-2" />},
                {name: 'Completed', url: '/app/vendor/completed', icon: <Cardholder className="mr-2"/>},
            ]
        }
        return [
            {name: 'Order Now', url: '/app', icon: <ListDashes size={20} className="mr-2" />},
            {name: 'Process', url: '/app/process', icon: <PlayCircle className="mr-2" /> },
            {name: 'Completed', url: '/app/completed', icon: <BatteryCharging className="mr-2" />},
        ]
    }, [isVendor])

    if (!isAuthenticated || pathname.indexOf('/app') < 0 )
        return <></>
        
    return <SidebarContainer>
        <Profile username={user.name} profileImage={user.profile} type={user.type} />
        <InformationCard>
            {menus.map(menu => (
                <CustomButton selected={pathname === menu.url} fun={()=>push(menu.url)} >
                    {isValidElement(menu.icon) && cloneElement(menu.icon)}
                    {menu.name}
                </CustomButton>
            ))}
        </InformationCard>
        <LogoutButton
            color={theme.colors.yellow}
            className="mx-auto mb-4 mt-auto"
            onClick={() => logout()}
        >
            Log Out
        </LogoutButton>
    </SidebarContainer>
}