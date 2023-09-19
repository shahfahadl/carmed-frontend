import { NextUIProvider, createTheme } from '@nextui-org/react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
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


function MyApp({ Component, pageProps }) {
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <NextUIProvider theme={nextUITheme} >
        <AuthProvider>
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