import '@/styles/globals.scss';
import '@/styles/reset.scss';
import '@/styles/themes.scss';
import '@/styles/vars.scss';
import 'react-toastify/dist/ReactToastify.css';

import { PageLayout } from '@/components/layout';
import { CookieService } from '@/lib/services';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { NextPageContext } from 'next';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

interface InitialPropInterface {
  user: PrivateProfile;
}
export default function MyApp({ Component, pageProps }: AppProps<InitialPropInterface>) {
  return (
    <ThemeProvider>
      <ToastContainer />
      <PageLayout user={pageProps?.user}>
        <Component {...pageProps} />
      </PageLayout>
    </ThemeProvider>
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
