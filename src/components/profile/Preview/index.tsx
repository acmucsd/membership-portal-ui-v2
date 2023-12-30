import { PublicProfile } from '@/lib/types/apiResponses';
import { getProfilePicture, isSrcAGif } from '@/lib/utils';
import Image from 'next/image';
import styles from './style.module.scss';

interface PreviewProps {
  user: PublicProfile;
  pfpCacheBust?: number;
}

const Preview = ({ user, pfpCacheBust }: PreviewProps) => {
  return (
    <div className={styles.wrapper}>
      <Image
        src={getProfilePicture(user) + (pfpCacheBust !== -1 ? `?_=${pfpCacheBust}` : '')}
        alt="Profile picture"
        width={125}
        height={125}
        unoptimized={isSrcAGif(user.profilePicture)}
      />
      <p>
        {user.firstName} {user.lastName}
      </p>
      <p>/{user.handle}</p>
      <p>{user.major}</p>
      <ul>
        <li>
          <span>Class of</span> <span>{user.graduationYear}</span>
        </li>
        <li>
          <span>Level</span> <span>TODO</span>
        </li>
        <li>
          <span>Points</span> <span>{user.points}</span>
        </li>
      </ul>
      <h3>Bio</h3>
      <p>{user.bio}</p>
    </div>
  );
};

export default Preview;
