import { Typography } from '@/components/common';
import GifSafeImage from '@/components/common/GifSafeImage';
import SocialMediaIcon from '@/components/profile/SocialMediaIcon';
import { PublicProfile } from '@/lib/types/apiResponses';
import { SocialMediaType } from '@/lib/types/enums';
import { fixUrl, getLevel, getProfilePicture } from '@/lib/utils';
import styles from './style.module.scss';

interface PreviewStatProps {
  title: string;
  value: number;
}
const PreviewStat = ({ title, value }: PreviewStatProps) => (
  <li className={styles.stat}>
    <Typography variant="h4/regular" component="span" className={styles.faded}>
      {title}
    </Typography>{' '}
    <Typography variant="h3/bold" component="span">
      {value}
    </Typography>
  </li>
);

interface PreviewProps {
  user: PublicProfile;
  pfpCacheBust?: number;
}

const Preview = ({ user, pfpCacheBust }: PreviewProps) => {
  return (
    <div className={styles.wrapper}>
      <GifSafeImage
        className={styles.pfp}
        src={getProfilePicture(user) + (pfpCacheBust !== -1 ? `?_=${pfpCacheBust}` : '')}
        alt="Profile picture"
        width={90}
        height={90}
      />
      <Typography variant="h2/bold" component="p">
        {user.firstName} {user.lastName}
      </Typography>
      <Typography variant="h5/medium" component="p" className={styles.faded}>
        /{user.handle}
      </Typography>
      <Typography variant="h4/medium" component="p" className={styles.major}>
        {user.major}
      </Typography>
      <ul className={styles.stats}>
        <PreviewStat title="Class of" value={user.graduationYear} />
        <PreviewStat title="Level" value={getLevel(user.points)} />
        <PreviewStat title="Points" value={user.points} />
      </ul>
      <Typography variant="h3/bold" component="h3">
        Bio
      </Typography>
      <Typography variant="h5/regular" component="p" className={styles.bio}>
        {user.bio}
      </Typography>
      <div className={styles.socials}>
        {user.userSocialMedia?.map(social => (
          <a
            href={
              social.type === SocialMediaType.EMAIL ? `mailto:${social.url}` : fixUrl(social.url)
            }
            key={social.type}
          >
            <SocialMediaIcon type={social.type} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Preview;
