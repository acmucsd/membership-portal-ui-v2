import Logo from '@/public/assets/acm-logos/general/light-mode.png';
import Head from 'next/head';

const TITLE = 'ACM UCSD Membership Portal';
const DESC =
  'Meet new friends, discover exciting events, and earn points for free ACM swag! Create an account today to find your community!';

interface SEOProps {
  title?: string;
  description?: string;
}

const SEO = ({ title, description = DESC }: SEOProps) => {
  const fullTitle = title ? `${title} | ${TITLE}` : TITLE;

  return (
    <Head>
      {/* google indexing data */}

      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* link sharing data */}

      {/* page url to be used as permanent id */}
      <meta property="og:url" content="https://members.acmucsd.com" />
      {/* type of content */}
      <meta property="og:type" content="website" />
      {/* actual website title */}
      <meta property="og:site_name" content="ACM at UCSD" />
      {/* title to display for the specific link being shared */}
      <meta property="og:title" content={fullTitle} />
      {/* preview image */}
      <meta property="og:image" content={Logo.src} />
      {/* preview description text */}
      <meta property="og:description" content={description} />
    </Head>
  );
};

export default SEO;
