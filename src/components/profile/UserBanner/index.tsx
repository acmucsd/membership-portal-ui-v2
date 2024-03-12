import { PublicAttendance } from '@/lib/types/apiResponses';
import { Community } from '@/lib/types/enums';
import styles from './style.module.scss';

interface UserBannerProps {
  attendances?: PublicAttendance[];
}

/** */
const UserBanner = ({ attendances }: UserBannerProps) => {
  if (!attendances || attendances.length === 0) {
    return <div className={styles.banner} />;
  }

  const communityAttendanceCounts: Record<Community, number> = {
    Hack: 10,
    AI: 10,
    Design: 10,
    Cyber: 10,
    General: 10,
  };

  const totalAttendanceCount = attendances.length;

  /**
  attendances.forEach(({ event: { committee } }) => {
    switch (committee.toLowerCase()) {
      case 'hack':
        communityAttendanceCounts.Hack += 1;
        break;
      case 'ai':
        communityAttendanceCounts.AI += 1;
        break;
      case 'design':
        communityAttendanceCounts.Design += 1;
        break;
      case 'cyber':
        communityAttendanceCounts.Cyber += 1;
        break;
      default:
        communityAttendanceCounts.General += 1;
    }
  });
  */

  const calculateGradient = (color: string, position: string, community: Community) => {
    const intensity = communityAttendanceCounts[community] / totalAttendanceCount;
    return `radial-gradient(circle at ${position},${color},transparent ${intensity * 100}%)`;
  };

  return (
    <div className={styles.banner}>
      <div
        className={styles.communityColor}
        style={{
          backgroundImage: calculateGradient('#f9a857', '0% 0%', Community.HACK),
        }}
      />
      <div
        className={styles.communityColor}
        style={{
          backgroundImage: calculateGradient('#ff6f6f', '50% 0%', Community.AI),
        }}
      />
      <div
        className={styles.communityColor}
        style={{
          backgroundImage: calculateGradient('#51c0c0', '100% 0%', Community.CYBER),
        }}
      />
      <div
        className={styles.communityColor}
        style={{
          backgroundImage: calculateGradient('#ff94b4', '0% 100%', Community.DESIGN),
        }}
      />
      <div
        className={styles.communityColor}
        style={{
          backgroundImage: calculateGradient('#62b0ff', '100% 100%', Community.GENERAL),
        }}
      />
    </div>
  );
};

export default UserBanner;
