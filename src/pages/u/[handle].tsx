import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PublicProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getDefaultAvatarSrc } from '@/lib/utils';
import MajorIcon from '@/public/assets/icons/major-icon.svg';
import ProfileIcon from '@/public/assets/icons/profile-icon.svg';
import styles from '@/styles/pages/user-profile.module.scss';
import Image from 'next/image';
import type { GetServerSideProps } from 'next/types';

interface UserProfilePageProps {
  user: PublicProfile;
}

const UserProfilePage = ({ user }: UserProfilePageProps) => {
  return (
    <div className={styles.profilePage}>
      <div className={styles.cardWrapper}>
        <div className={styles.banner} />
        <div className={styles.profileCard}>
          <div
            className={styles.horizontal}
            style={{ gap: '1rem', width: '100%', flexWrap: 'wrap' }}
          >
            <div className={styles.profilePic}>
              <Image
                src={user.profilePicture ?? getDefaultAvatarSrc(user.uuid)}
                alt="Profile Picture"
                fill
                priority
                className={styles.profilePic}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h1>{`${user.firstName} ${user.lastName}`}</h1>
              <h5>@{user.handle}</h5>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                flexDirection: 'column',
                flexGrow: 1,
              }}
            >
              <h4>Polynomial Pita</h4>
              <h3>{user.points} Leaderboard Points</h3>
            </div>
          </div>
        </div>
      </div>

      <div
        className={styles.section}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h2>My Progress</h2>
        <div className={styles.progressInfo}>
          <h3>Level 10</h3>
          <h3>70/100</h3>
          <div className={styles.progressBar}>
            <div className={styles.inner} style={{ width: '20%' }} />
          </div>
        </div>
        You need 30 more points to level up to Cubic Croissant
      </div>

      <div className={`${styles.section} ${styles.horizontal}`}>
        <div style={{ flex: 2 }}>
          <h2>About me</h2>
          <h3>
            <ProfileIcon />
            Class of {user.graduationYear}
          </h3>
          <h3>
            <MajorIcon />
            {user.major}
          </h3>
        </div>
        <div style={{ flex: 3 }}>
          <h2>Bio</h2>
          <p>{user.bio || <i>Nothing here...</i>}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Recently Attended Events</h2>
      </div>
    </div>
  );
};

export default UserProfilePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const handle = params?.handle as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const user = await UserAPI.getUserByHandle(token, handle);
    return {
      props: {
        user,
      },
    };
  } catch (err: any) {
    return { redirect: { destination: config.homeRoute, permanent: false } };
  }
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
