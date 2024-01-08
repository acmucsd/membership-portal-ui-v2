import { Carousel, Typography } from '@/components/common';
import EventCard from '@/components/events/EventCard';
import { config } from '@/lib';
import { PublicAttendance, type PublicProfile } from '@/lib/types/apiResponses';
import { getProfilePicture, getUserRank } from '@/lib/utils';
import DevpostIcon from '@/public/assets/icons/devpost-icon.svg';
import EditIcon from '@/public/assets/icons/edit.svg';
import FacebookIcon from '@/public/assets/icons/facebook-icon.svg';
import GithubIcon from '@/public/assets/icons/github-icon.svg';
import InstagramIcon from '@/public/assets/icons/instagram.svg';
import LeaderboardIcon from '@/public/assets/icons/leaderboard-icon.svg';
import LinkedinIcon from '@/public/assets/icons/linkedin-icon.svg';
import MajorIcon from '@/public/assets/icons/major-icon.svg';
import ProfileIcon from '@/public/assets/icons/profile-icon.svg';
import styles from '@/styles/pages/u/index.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AiOutlineLink } from 'react-icons/ai';
import { IoMail } from 'react-icons/io5';

interface UserProfilePageProps {
  user: PublicProfile;
  isSignedInUser: boolean;
  signedInAttendances: PublicAttendance[];
  attendances?: PublicAttendance[];
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

const UserProfilePage = ({
  user,
  attendances,
  signedInAttendances,
  isSignedInUser,
}: UserProfilePageProps) => {
  // animate the progress bar
  const [progress, setProgress] = useState<Number>(0);
  useEffect(() => setProgress(user.points % 100), [user.points]);

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
            <div className={styles.rank}>{getUserRank(user.points)[1]}</div>
            <div className={styles.points}>
              <LeaderboardIcon /> &nbsp;
              {user.points.toLocaleString()} Leaderboard Points
            </div>
          </div>
          {isSignedInUser && (
            <div className={styles.editWrapper}>
              <Link href={config.profile.editRoute}>
                <div>
                  <EditIcon />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.section} ${styles.progressSection}`}>
        <Typography variant="h2/bold">
          {isSignedInUser ? 'My' : `${user.firstName}'s`} Progress
        </Typography>
        <div className={styles.progressInfo}>
          <Typography variant="h4/regular">Level {getUserRank(user.points)[0]}</Typography>
          <Typography variant="h4/regular">{user.points % 100}/100</Typography>
          <div className={styles.progressBar}>
            <div className={styles.inner} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Typography variant="h5/regular" component="p">
          {isSignedInUser ? 'You need' : `${user.firstName} needs`} {100 - (user.points % 100)} more
          points to level up to
          <Typography variant="h5/bold" component="span">
            &nbsp;{getUserRank(user.points + 100)[1]}
          </Typography>
        </Typography>
      </div>

      <div className={`${styles.section} ${styles.aboutSection}`}>
        <div>
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
        <div className={styles.bioSection}>
          <Typography variant="h2/bold">Bio</Typography>
          <Typography variant="h5/medium" component="p">
            {user.bio || <i>Nothing here...</i>}
          </Typography>
        </div>
        {isSignedInUser && (
          <div className={styles.editWrapper}>
            <Link href={config.profile.editRoute}>
              <div>
                <EditIcon />
              </div>
            </Link>
          </div>
        )}
      </div>
      {(attendances || isSignedInUser) && (
        <div className={styles.section}>
          <Typography variant="h2/bold">Recently Attended Events</Typography>
          <Carousel>
            {(isSignedInUser ? signedInAttendances : (attendances as PublicAttendance[])).map(
              ({ event }) => (
                <EventCard
                  className={styles.card}
                  key={event.uuid}
                  event={event}
                  attended={signedInAttendances.some(({ event: { uuid } }) => uuid === event.uuid)}
                />
              )
            )}
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
