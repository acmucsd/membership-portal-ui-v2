import Head from 'next/head';

const SEO = () => {
  const TITLE = 'ACM UCSD Membership Portal';
  const DESC =
    'Join us. ACM at UCSD is an inclusive community of students passionate about technology. 1000+ UCSD members. 120+ annual events. 850+ cups of boba served.';

  return (
    <Head>
      {/* google indexing data */}

      <title>{TITLE}</title>
      <meta name="description" content={DESC} />
      <link rel="shortcut icon" href="/favicon.ico" />

      {/* link sharing data */}

      {/* page url to be used as permanent id */}
      <meta property="og:url" content={`https://members.acmucsd.com`} />
      {/* type of content */}
      <meta property="og:type" content="website" />
      {/* actual website title */}
      <meta property="og:site_name" content={'ACM at UCSD'} />
      {/* title to display for the specific link being shared */}
      <meta property="og:title" content={TITLE} />
      {/* preview image */}
      <meta
        property="og:image"
        content="https://cdn.discordapp.com/attachments/975657067031437332/1092620423281250335/Screenshot_2023-04-03_at_6.23.24_PM.jpg"
      />
      {/* preview description text */}
      <meta property="og:description" content={DESC} />
    </Head>
  );
};

export default SEO;
