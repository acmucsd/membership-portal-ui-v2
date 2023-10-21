import '@/styles/globals.scss';
import '@/styles/reset.scss';
import '@/styles/themes.scss';
import '@/styles/vars.scss';
import 'react-toastify/dist/ReactToastify.css';

import { SEO } from '@/components/common';
import { PageLayout } from '@/components/layout';
import { CookieService } from '@/lib/services';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material';
import { NextPageContext } from 'next';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { DM_Sans as DMSans } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

interface InitialPropInterface {
  user: PrivateProfile;
}
const dmSans = DMSans({ subsets: ['latin'], weight: ['400', '500', '700'] });

export default function MyApp({ Component, pageProps }: AppProps<InitialPropInterface>) {
  const theme = createTheme({
    typography: {
      fontFamily: dmSans.style.fontFamily,
      fontSize: 16,
    },
  });

  return (
    <>
      <style jsx global>{`
        * {
          font-family: ${dmSans.style.fontFamily}, sans-serif;
        }
      `}</style>
      <SEO />
      <ThemeProvider>
        <MUIThemeProvider theme={theme}>
          <ToastContainer />
          <PageLayout user={pageProps?.user}>
            <Component {...pageProps} />
          </PageLayout>
        </MUIThemeProvider>
      </ThemeProvider>
    </>
  );
}

MyApp.getInitialProps = ({ req, res }: NextPageContext) => {
  const userCookie = CookieService.getServerCookie(CookieType.USER, { req, res });

  if (!userCookie) {
    return {
      user: null,
    };
  }

  const user: PrivateProfile = JSON.parse(userCookie);

  return {
    user,
  };
};
