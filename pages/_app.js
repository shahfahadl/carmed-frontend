import { NextUIProvider, createTheme } from '@nextui-org/react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { theme } from '@utility/theme';
import { AuthProvider } from '@contexts/auth';
import { Sidebar } from '@layouts/sidebar';
import { Toaster } from 'react-hot-toast';
import AppBody from '@layouts/appBody';

const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: none;
    font-family: 'Inter', sans-serif;
  }

  h1, h2, h3, h4, h5, h6{
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    color: ${({theme}) => theme.colors.darkPurple};
  }
  .w-100{
    width: 100%;
  }
`

const nextUITheme = createTheme({
  type:'light',
  theme: {
    colors: {
      error: '#F13030',
    },
  }
})

const MobileModePopup = styled.div`
  display: none;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(10px);
  z-index: 20;
  align-items: center;
  justify-content: center;
  .card{
    display: flex;
    align-items: center;
    justify-content: center;
    background: black;
    color: white;
    width: 250px;
    padding: 20px;
    border-radius: 10px;
    flex-direction: column;
    img{
      height: 200px;
      margin-bottom: 10px;
    }
  }
  @media only screen and (max-width: 950px) {
    display: flex;
  }
`

function MyApp({ Component, pageProps }) {
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <NextUIProvider theme={nextUITheme} >
        <AuthProvider>
          <MobileModePopup>
            <div className='card' >
              <img src="/images/landing/phone.svg" />
              Kindly Open Mobile App
            </div>
          </MobileModePopup>
            <Sidebar/>
            <Toaster/>
            <AppBody>
            <Component {...pageProps} />
            </AppBody>
        </AuthProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
}

export default MyApp;