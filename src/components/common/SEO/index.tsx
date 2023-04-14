import Logo from '@/public/assets/acm-logos/general/light-mode.png';
import Head from 'next/head';

const SEO = () => {
  const TITLE = 'ACM UCSD Membership Portal';
  const DESC =
    'Meet new friends, discover exciting events, and earn points for free ACM swag! Create an account today to find your community!';

  return (
    <Head>
      {/* google indexing data */}

      <title>{TITLE}</title>
      <meta name="description" content={DESC} />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* link sharing data */}

      {/* page url to be used as permanent id */}
      <meta property="og:url" content="https://members.acmucsd.com" />
      {/* type of content */}
      <meta property="og:type" content="website" />
      {/* actual website title */}
      <meta property="og:site_name" content="ACM at UCSD" />
      {/* title to display for the specific link being shared */}
      <meta property="og:title" content={TITLE} />
      {/* preview image */}
      <meta property="og:image" content={Logo.src} />
      {/* preview description text */}
      <meta property="og:description" content={DESC} />
    </Head>
  );
};

export default SEO;
