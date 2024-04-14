import Logo from '@/public/assets/acm-logos/general/light-mode.png';
import Head from 'next/head';

const TITLE = 'ACM UCSD Membership Portal';
const DESC =
  'Meet new friends, discover exciting events, and earn points for free ACM swag! Create an account today to find your community!';

interface SEOProps {
  title?: string;
  description?: string;
  previewImage?: string;
  bigPreviewImage?: boolean;
}

const SEO = ({
  title,
  description = DESC,
  previewImage = Logo.src,
  bigPreviewImage = false,
}: SEOProps) => {
  return (
    <Head>
      {/* google indexing data */}

      <title>{title ? `${title} | ${TITLE}` : TITLE}</title>
      <meta name="description" content={description} />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* link sharing data */}

      {/* page url to be used as permanent id */}
      <meta property="og:url" content="https://members.acmucsd.com" />
      {/* type of content */}
      <meta property="og:type" content="website" />
      {/* actual website title */}
      <meta property="og:site_name" content="ACM at UC San Diego" />
      {/* title to display for the specific link being shared */}
      <meta property="og:title" content={title ?? TITLE} />
      {/* preview image */}
      <meta property="og:image" content={previewImage} />
      {/* make preview image large on Discord and other sites */}
      {bigPreviewImage ? <meta name="twitter:card" content="summary_large_image" /> : null}
      {/* preview description text */}
      <meta property="og:description" content={description} />
    </Head>
  );
};

export default SEO;
