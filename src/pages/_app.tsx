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
import { NextPageContext } from 'next';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { DM_Sans as DMSans } from 'next/font/google';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';

interface InitialPropInterface {
  user?: PrivateProfile;
}
const dmSans = DMSans({ subsets: ['latin'], weight: ['400', '500', '700'] });

export default function MyApp({ Component, pageProps }: AppProps<InitialPropInterface>) {
  const [user, setUser] = useState(pageProps?.user);

  // For 404 page: Try getting user from cookie on client side (because 404
  // pages in Next.js must be a static page)
  useEffect(() => {
    if (pageProps?.user) {
      setUser(pageProps?.user);
      return;
    }
    const userCookie = CookieService.getClientCookie(CookieType.USER);
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, [pageProps?.user]);

  return (
    <>
      <style jsx global>{`
        * {
          font-family: ${dmSans.style.fontFamily}, sans-serif;
        }
      `}</style>
      <SEO />
      <ThemeProvider>
        <ToastContainer />
        <PageLayout user={user}>
          <Component {...pageProps} user={user} />
        </PageLayout>
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
