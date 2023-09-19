import Image from 'next/image';
import Link from 'next/link';
import type { RefObject } from 'react';
import styles from './style.module.scss';

interface LeaderboardRowProps {
  position: number;
  rank: string;
  name: string;
  url: string;
  points: number;
  image: string;
  match?: {
    index: number;
    length: number;
  };
  rowRef: RefObject<HTMLAnchorElement> | null;
}

const LeaderboardRow = ({
  position,
  rank,
  name,
  url,
  points,
  image,
  match,
  rowRef,
}: LeaderboardRowProps) => {
  return (
    <Link href={url} className={styles.row} ref={rowRef}>
      <span className={styles.position}>{position}</span>
      <Image
        src={image}
        width={36}
        height={36}
        quality={10}
        alt={`Profile picture for ${name}`}
        className={styles.profilePicture}
      />
      <div className={styles.nameRank}>
        <span className={styles.name}>
          {match ? (
            <>
              {name.slice(0, match.index)}
              <span className={styles.match}>
                {name.slice(match.index, match.index + match.length)}
              </span>
              {name.slice(match.index + match.length)}
            </>
          ) : (
            name
          )}
        </span>
        <span className={styles.rank}>{rank}</span>
      </div>
      <span className={styles.points}>{points} points</span>
    </Link>
  );
};

export default LeaderboardRow;
