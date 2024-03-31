import '@/styles/globals.scss';
import '@/styles/reset.scss';
import '@/styles/themes.scss';
import '@/styles/vars.scss';
import 'react-toastify/dist/ReactToastify.css';

import { SEO } from '@/components/common';
import { PageLayout } from '@/components/layout';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { DM_Sans as DMSans } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

const dmSans = DMSans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export default function MyApp({ Component, pageProps, router }: AppProps) {
  let { title } = pageProps;
  if (router.pathname === '/404') {
    title = '404';
  } else if (router.pathname === '/500') {
    title = '500';
  }

  return (
    <>
      <style jsx global>{`
        * {
          transition: all ease;
          font-family: ${dmSans.style.fontFamily}, sans-serif;
        }
      `}</style>
      <SEO title={title} description={pageProps.description} />
      <ThemeProvider>
        <ToastContainer />
        <PageLayout accessType={pageProps?.user?.accessType}>
          <Component {...pageProps} />
        </PageLayout>
      </ThemeProvider>
    </>
  );
}
