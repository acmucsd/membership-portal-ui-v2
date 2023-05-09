import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import type { PublicProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import defaultProfilePicture from '@/public/assets/profile-pics/adorable0.png';
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
          <div className={styles.cardHalf}>
            <div className={styles.horizontal}>
              <div className={styles.profilePic}>
                <Image
                  src={user.profilePicture ?? defaultProfilePicture}
                  alt="Profile Picture"
                  fill
                />
              </div>
              <div style={{ marginLeft: '1rem' }}>
                <h1>{`${user.firstName} ${user.lastName}`}</h1>
                <h3>@{user.handle}</h3>
                <h2>Rank Here</h2>
              </div>
            </div>
            <div className={styles.iconBox}>icon icon icon icon</div>
          </div>
          <div className={styles.cardHalf}>
            <h2>Points</h2>
            <h2>Class of {user.graduationYear}</h2>
            <h2>{user.major}</h2>
          </div>
        </div>
      </div>

      <div className={styles.about}>
        <h1>About me</h1>
        <p>{'' || <i>Nothing here...</i>}</p>
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
