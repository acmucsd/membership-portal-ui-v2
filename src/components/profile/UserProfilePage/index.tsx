import { Carousel, GifSafeImage, Typography } from '@/components/common';
import { EventCard } from '@/components/events';
import SocialMediaIcon from '@/components/profile/SocialMediaIcon';
import { config, showToast } from '@/lib';
import { PublicAttendance, type PublicProfile } from '@/lib/types/apiResponses';
import { SocialMediaType } from '@/lib/types/enums';
import { copy, fixUrl, getLevel, getProfilePicture, getUserRank } from '@/lib/utils';
import EditIcon from '@/public/assets/icons/edit.svg';
import GradCapIcon from '@/public/assets/icons/grad-cap-icon.svg';
import LeaderboardIcon from '@/public/assets/icons/leaderboard-icon.svg';
import MajorIcon from '@/public/assets/icons/major-icon.svg';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';

export interface UserProfilePageProps {
  handleUser: PublicProfile;
  isSignedInUser: boolean;
  signedInAttendances: PublicAttendance[];
  recentAttendances: PublicAttendance[];
}

export const UserProfilePage = ({
  handleUser,
  recentAttendances,
  signedInAttendances,
  isSignedInUser,
}: UserProfilePageProps) => {
  // animate the progress bar
  const [progress, setProgress] = useState<Number>(0);
  useEffect(() => setProgress(handleUser.points % 100), [handleUser.points]);
  const levelText = `Level ${getLevel(handleUser.points)}: ${getUserRank(handleUser.points)}`;
  const nextLevelRank = getUserRank(handleUser.points + 100);
  const userName = `${handleUser.firstName} ${handleUser.lastName}`;

  return (
    <div className={styles.profilePage}>
      <div className={styles.cardWrapper}>
        <div className={styles.banner} />
        <div className={styles.profileCard}>
          <div className={styles.profilePic}>
            <GifSafeImage
              src={getProfilePicture(handleUser)}
              alt="Profile Picture"
              height={112} // 7 rem
              width={112} // 7 rem
              priority
              className={styles.profilePic}
            />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.cardName}>
              <Typography variant="h1/bold" component="h1">
                {userName}
              </Typography>
              <Typography
                variant="h5/regular"
                onClick={() => {
                  copy(window.location.href);
                  showToast(`Copied link to ${userName}'s profile!`);
                }}
                className={styles.handle}
              >
                @{handleUser.handle}
              </Typography>
            </div>
            <div className={styles.points}>
              <LeaderboardIcon /> &nbsp;
              <Typography variant="h5/regular" component="span">
                {handleUser.points.toLocaleString()} Points
              </Typography>
            </div>
          </div>
          {isSignedInUser ? (
            <div className={styles.editWrapper}>
              <Link href={config.profile.editRoute}>
                <div>
                  <EditIcon />
                </div>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
      <div className={`${styles.section} ${styles.progressSection}`}>
        <Typography variant="h2/bold" className={styles.sectionHeader}>
          {isSignedInUser ? 'My' : `${handleUser.firstName}'s`} Progress
        </Typography>
        <div className={styles.progressInfo}>
          <div className={styles.progressText}>
            <Typography variant="h4/regular" className={styles.levelText}>
              {levelText}
            </Typography>
            <Typography variant="h4/regular" className={styles.levelProgress}>
              {handleUser.points % 100}/100
            </Typography>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.inner} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <Typography variant="h5/regular" component="p">
          {isSignedInUser ? 'You need ' : `${handleUser.firstName} needs `}
          {100 - (handleUser.points % 100)} more points to level up to
          <Typography variant="h5/bold" component="span">
            &nbsp;{nextLevelRank}
          </Typography>
        </Typography>
      </div>

      <div className={`${styles.section} ${styles.aboutSection}`}>
        <div>
          <Typography variant="h2/bold" className={styles.sectionHeader}>
            About me
          </Typography>
          <div className={styles.aboutMeSection}>
            <GradCapIcon className={styles.icon} />
            <Typography variant="h5/regular">Class of {handleUser.graduationYear}</Typography>
            <MajorIcon className={styles.icon} />
            <Typography variant="h5/regular">{handleUser.major}</Typography>
          </div>
          <div className={styles.socialIcons}>
            {handleUser.userSocialMedia?.map(social => (
              <a
                href={
                  social.type === SocialMediaType.EMAIL
                    ? `mailto:${social.url}`
                    : fixUrl(social.url)
                }
                key={social.type}
              >
                <SocialMediaIcon type={social.type} />
              </a>
            ))}
          </div>
        </div>
        <div className={styles.bioSection}>
          <Typography variant="h2/bold" className={styles.sectionHeader}>
            Bio
          </Typography>
          <Typography variant="h5/regular" component="p">
            {handleUser.bio || <i>Nothing here...</i>}
          </Typography>
        </div>
      </div>
      {recentAttendances || isSignedInUser ? (
        <div className={styles.section}>
          <Typography variant="h2/bold" className={styles.sectionHeader}>
            Recently Attended Events
            {!handleUser.isAttendancePublic ? (
              <Typography variant="h5/regular" component="span">
                &nbsp;<i>(hidden for other users)</i>
              </Typography>
            ) : null}
          </Typography>
          <Carousel>
            {recentAttendances.map(({ event }) => (
              <EventCard
                className={styles.card}
                key={event.uuid}
                event={event}
                attended={signedInAttendances.some(({ event: { uuid } }) => uuid === event.uuid)}
              />
            ))}
          </Carousel>
        </div>
      ) : null}
    </div>
  );
};
