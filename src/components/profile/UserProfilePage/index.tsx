import { EditButton, GifSafeImage, Typography } from '@/components/common';
import { EventCarousel } from '@/components/events';
import Banner from '@/components/profile/Banner';
import SocialMediaIcon from '@/components/profile/SocialMediaIcon';
import { UserProgress } from '@/components/profile/UserProgress';
import { config, showToast } from '@/lib';
import { PublicAttendance, type PublicProfile } from '@/lib/types/apiResponses';
import { SocialMediaType } from '@/lib/types/enums';
import { copy, fixUrl, getProfilePicture } from '@/lib/utils';
import GradCapIcon from '@/public/assets/icons/grad-cap-icon.svg';
import LeaderboardIcon from '@/public/assets/icons/leaderboard-icon.svg';
import MajorIcon from '@/public/assets/icons/major-icon.svg';
import Link from 'next/link';
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
  const fullName = `${handleUser.firstName} ${handleUser.lastName}`;

  return (
    <div className={styles.profilePage}>
      <div
        className={`${styles.cardWrapper} ${recentAttendances.length > 0 ? styles.hasBanner : ''}`}
      >
        {recentAttendances.length > 0 ? (
          <div className={styles.banner}>
            {/* Restart the animation when the UUID changes (e.g. navigating from user profile -> my profile) */}
            <Banner
              uuid={handleUser.uuid}
              recentAttendances={recentAttendances}
              key={handleUser.uuid}
            />
          </div>
        ) : null}
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
                {fullName}
              </Typography>
              <Typography
                variant="h5/regular"
                onClick={() => {
                  copy(window.location.href);
                  showToast(`Copied link to ${handleUser.firstName}'s profile!`);
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
              <EditButton href={config.profile.editRoute} label="Edit Profile" />
            </div>
          ) : null}
        </div>
      </div>
      <Link href={config.leaderboardRoute} className={styles.section}>
        <UserProgress
          user={handleUser}
          points={handleUser.points}
          isSignedInUser={isSignedInUser}
          levelTextVariant="h4/regular"
          levelDescriptionVariant="h5/regular"
        />
      </Link>

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
          {handleUser.userSocialMedia && handleUser.userSocialMedia.length > 0 ? (
            <div className={styles.socialIcons}>
              {handleUser.userSocialMedia.map(social => (
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
          ) : null}
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
        <EventCarousel
          title={
            handleUser.isAttendancePublic ? (
              'Recently Attended Events'
            ) : (
              <>
                Recently Attended Events
                <Typography variant="h5/regular" component="span">
                  &nbsp;<i>(hidden for other users)</i>
                </Typography>
              </>
            )
          }
          titleClassName={styles.sectionHeader}
          events={recentAttendances.map(({ event }) => event)}
          attendances={signedInAttendances}
          placeholder={`${
            isSignedInUser ? "You haven't" : `${handleUser.firstName} hasn't`
          } attended any events yet :(`}
        />
      ) : null}
    </div>
  );
};
