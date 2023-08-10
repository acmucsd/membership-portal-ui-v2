import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';

import ACMLogo from '@/public/assets/acm-logos/general/light-mode.png';
import DiscordIcon from '@/public/assets/icons/discord-icon.svg';
import FacebookIcon from '@/public/assets/icons/facebook-icon.svg';
import WebIcon from '@/public/assets/icons/globe-icon.svg';
import IgIcon from '@/public/assets/icons/instagram.svg';

import styles from '@/styles/pages/about.module.scss';
import { GetServerSideProps } from 'next';
import { useTheme } from 'next-themes';
import Image from 'next/image';

const AboutPage = () => {
  const { theme } = useTheme();
  const about = `With 100,000 members and 500+ chapters, the Association for Computing
  Machinery is the world's largest society for computing. Here at UC
  San Diego, our chapter has been established with the mission of
  creating a member-first community devoted to the field of computing.
  We welcome students of all backgrounds and skill levels to come
  develop their skills at our many workshops and form new friendships at
  our many socials. Get involved today by signing up for an event on
  this portal or following us on social media!`;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image className={styles.logo} src={ACMLogo} alt="logo" width={115} height={115} />
        <h1>
          About <b>ACM@UCSD</b>
        </h1>
      </div>
      <div className={styles.body}>
        <div className={styles.socials}>
          <p className={styles.description}>{about}</p>
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
