import { SnackbarProvider } from 'notistack';
import { GlobalStyles } from '@mui/material';
import { ReactNode } from 'react';
import { ThemeProvider as MaterialThemeProvider } from '@mui/material/styles';

import 'modern-css-reset/dist/reset.min.css';

import { theme } from '../theme';
import { ProecoNextPage } from '~/interfaces/proecoNextPage';
import { NavigationBar } from '~/components/parts/layout/NavigationBar';

const inputGlobalStyles = (
  <GlobalStyles
    styles={{
      '*': {
        MsOverflowStyle: 'none',
        scrollbarWidth: 'none',
      },
      '*::-webkit-scrollbar': { display: 'none' },
      body: {
        backgroundColor: `${theme.palette.backgroundColor.main}`,
      },
    }}
  />
);

function MyApp({ Component, pageProps }: { Component: ProecoNextPage; pageProps: { children?: ReactNode } }): JSX.Element {
  const getLayout =
    Component.getLayout ||
    ((page) => (
      <>
        <NavigationBar />
        {page}
      </>
    ));

  if (process.env.NEXT_PUBLIC_ENABLE_MOCK === 'TRUE') {
    const startServer = () => import('~/mocks/worker');
    startServer();
  }

  console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  console.log(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
  console.log(process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

  return (
    <MaterialThemeProvider theme={theme}>
      <SnackbarProvider>
        {inputGlobalStyles}
        {getLayout(<Component {...pageProps} />)}
      </SnackbarProvider>
    </MaterialThemeProvider>
  );
}

export default MyApp;
