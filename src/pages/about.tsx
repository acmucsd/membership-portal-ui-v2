import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';

import logo from '@/public/assets/acm-logos/general/light-mode.png';
import DiscordIcon from '@/public/assets/icons/discord-icon.svg';
import FacebookIcon from '@/public/assets/icons/facebook-icon.svg';
import WebIcon from '@/public/assets/icons/globe-icon.svg';
import IgIcon from '@/public/assets/icons/instagram.svg';

import styles from '@/styles/pages/about.module.scss';
import { GetServerSideProps } from 'next';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import config from '../lib/config';

const AboutPage = () => {
  const { theme } = useTheme();

  return (
    <div className={styles.aboutpage}>
      <div className={styles.title}>
        <Image className={styles.logo} src={logo} alt="logo" width={115} height={115} />
        <h1>
          About <b>ACM@UCSD</b>
        </h1>
      </div>
      <div className={styles.body}>
        <div className={styles.socials}>
          <p className={styles.description}>{config.about}</p>
          <a href="https://acmucsd.com">
            <div className={styles.theme}>
              <WebIcon />
            </div>
            acmurl.com
          </a>
          <a href="https://facebook.com/acm.ucsd">
            <div className={styles.theme}>
              <FacebookIcon />
            </div>
            facebook.com/acm.ucsd
          </a>
          <a href="https://instagram.com/acm.ucsd">
            <div className={styles.theme}>
              <IgIcon />
            </div>
            instagram.com/acm.ucsd
          </a>
          <a href="https://acmurl.com/discord">
            <div className={styles.theme}>
              <DiscordIcon />
            </div>
            acmurl.com/discord
          </a>
        </div>
        <div className={styles.discordpreview}>
          <iframe
            title="discord embed"
            src={`https://discordapp.com/widget?id=573028991527550986&theme=${theme}`}
            width="350px"
            height="500px"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
