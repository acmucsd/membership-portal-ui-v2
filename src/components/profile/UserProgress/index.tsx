import { Typography, type Variant } from '@/components/common';
import { type PublicProfile } from '@/lib/types/apiResponses';
import { getLevel, getUserRank } from '@/lib/utils';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';

export interface UserProgressProps {
  user: PublicProfile;
  points: number;
  isSignedInUser: boolean;
  levelTextVariant?: Variant;
  levelDescriptionVariant?: Variant;
}

export const UserProgress = ({
  user,
  points,
  isSignedInUser,
  levelTextVariant,
  levelDescriptionVariant,
}: UserProgressProps) => {
  const { firstName } = user;
  // animate the progress bar
  const [progress, setProgress] = useState<number>(0);
  useEffect(() => setProgress(points % 100), [points]);
  const currentRank = getUserRank(points);
  const nextLevelRank = getUserRank(points + 100);
  const levelText = `Level ${getLevel(points)}: ${currentRank}`;
  // If levelling up doesn't yield a new rank, just put the next level instead.
  const nextLevelText =
    currentRank === nextLevelRank ? `Level ${getLevel(points + 100)}` : nextLevelRank;

  return (
    <div className={styles.progressSection}>
      <Typography variant="h2/bold" className={styles.sectionHeader}>
        {isSignedInUser ? 'Your' : `${firstName}'s`} Progress
      </Typography>
      <div className={styles.progressInfo}>
        <div className={styles.progressText}>
          <Typography variant={levelTextVariant ?? 'h5/regular'} className={styles.levelText}>
            {levelText}
          </Typography>
          <Typography variant={levelTextVariant ?? 'h5/regular'} className={styles.levelProgress}>
            {points % 100}/100
          </Typography>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.inner} style={{ width: `${progress}%` }} />
        </div>
        <Typography
          variant={levelDescriptionVariant ?? 'h6/regular'}
          component="p"
          className={styles.levelDescription}
        >
          {isSignedInUser ? 'You need ' : `${firstName} needs `}
          {100 - (points % 100)} more points to level up to <strong>{nextLevelText}</strong>
        </Typography>
      </div>
    </div>
  );
};
