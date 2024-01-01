import { Carousel, Typography } from '@/components/common';
import EventCard from '@/components/events/EventCard';
import { config } from '@/lib';
import { UserAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PublicAttendance, type PublicProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getProfilePicture, getRank } from '@/lib/utils';
import DevpostIcon from '@/public/assets/icons/devpost-icon.svg';
import FacebookIcon from '@/public/assets/icons/facebook-icon.svg';
import GithubIcon from '@/public/assets/icons/github-icon.svg';
import InstagramIcon from '@/public/assets/icons/instagram.svg';
import LeaderboardIcon from '@/public/assets/icons/leaderboard-icon.svg';
import LinkedinIcon from '@/public/assets/icons/linkedin-icon.svg';
import MajorIcon from '@/public/assets/icons/major-icon.svg';
import ProfileIcon from '@/public/assets/icons/profile-icon.svg';
import styles from '@/styles/pages/user-profile.module.scss';
import Image from 'next/image';
import type { GetServerSideProps } from 'next/types';
import { useEffect, useState } from 'react';
import { AiOutlineLink } from 'react-icons/ai';
import { IoMail } from 'react-icons/io5';

interface UserProfilePageProps {
  user: PublicProfile;
  attendances?: PublicAttendance[];
  signedInAttendances?: PublicAttendance[];
}

const socialMediaIcons = {
  LINKEDIN: LinkedinIcon,
  GITHUB: GithubIcon,
  DEVPOST: DevpostIcon,
  PORTFOLIO: AiOutlineLink,
  FACEBOOK: FacebookIcon,
  INSTAGRAM: InstagramIcon,
  EMAIL: IoMail,
};

const UserProfilePage = ({ user, attendances, signedInAttendances }: UserProfilePageProps) => {
  // animate the progress bar
  const [progress, setProgress] = useState<Number>(0);
  useEffect(() => setProgress(user.points % 100), [user.points]);
  console.log(user);

  return (
    <div className={styles.profilePage}>
      <div className={styles.cardWrapper}>
        <div className={styles.banner} />
        <div className={styles.profileCard}>
          <div className={styles.profilePic}>
            <Image
              src={getProfilePicture(user)}
              alt="Profile Picture"
              fill
              priority
              className={styles.profilePic}
            />
          </div>
          <div className={styles.cardName}>
            <Typography variant="h1/bold">{`${user.firstName} ${user.lastName}`}</Typography>
            <Typography variant="h5/medium">@{user.handle}</Typography>
          </div>
          <div className={styles.cardRank}>
            <div className={styles.rank}>{getRank(user.points)[1]}</div>
            <div className={styles.points}>
              <LeaderboardIcon /> &nbsp;
              {user.points.toLocaleString()} Leaderboard Points
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.section} ${styles.progressSection}`}>
        <Typography variant="h2/bold">My Progress</Typography>
        <div className={styles.progressInfo}>
          <Typography variant="h4/regular">Level {getRank(user.points)[0]}</Typography>
          <Typography variant="h4/regular">{user.points % 100}/100</Typography>
          <div className={styles.progressBar}>
            <div className={styles.inner} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Typography variant="h5/regular" component="p">
          You need {100 - (user.points % 100)} more points to level up to
          <Typography variant="h5/bold" component="span">
            &nbsp;{getRank(user.points + 100)[1]}
          </Typography>
        </Typography>
      </div>

      <div className={`${styles.section} ${styles.aboutSection}`}>
        <div style={{ flex: 2 }}>
          <Typography variant="h2/bold">About me</Typography>
          <div className={styles.aboutMeSection}>
            <ProfileIcon className={styles.icon} />
            <Typography variant="h4/regular">Class of {user.graduationYear}</Typography>
            <MajorIcon className={styles.icon} />
            <Typography variant="h4/regular">{user.major}</Typography>
          </div>
          <div>
            {user.userSocialMedia &&
              Object.entries(socialMediaIcons)?.map(([key, Icon]) => {
                const matchingSocialMedia = user.userSocialMedia.find(obj => obj.type === key);
                if (!matchingSocialMedia) return null;
                return (
                  <a key={key} href={matchingSocialMedia.url}>
                    <Icon />
                  </a>
                );
              })}
          </div>
        </div>
        <div style={{ flex: 3 }}>
          <Typography variant="h2/bold">Bio</Typography>
          <Typography variant="h5/medium" component="p">
            {user.bio || <i>Nothing here...</i>}
          </Typography>
        </div>
      </div>
      {attendances && signedInAttendances && (
        <div className={styles.section}>
          <Typography variant="h2/bold">Recently Attended Events</Typography>
          <Carousel>
            {attendances.map(({ event }) => (
              <EventCard
                className={styles.card}
                key={event.uuid}
                event={event}
                attended={signedInAttendances.some(({ event: { uuid } }) => uuid === event.uuid)}
              />
            ))}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;

const getServerSidePropsFunc: GetServerSideProps = async ({ params, req, res }) => {
  const handle = params?.handle as string;
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  try {
    const user = await UserAPI.getUserByHandle(token, handle);
    if (!user.isAttendancePublic) {
      return { props: { user } };
    }

    const attendances = await UserAPI.getAttendancesForUserByUUID(token, user.uuid);
    const signedInAttendances = await UserAPI.getAttendancesForCurrentUser(token);
    return {
      props: {
        user,
        attendances,
        signedInAttendances,
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
