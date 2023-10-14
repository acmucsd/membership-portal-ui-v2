import { isSrcAGif } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
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
  scrollIntoView: boolean;
}

const LeaderboardRow = ({
  position,
  rank,
  name,
  url,
  points,
  image,
  match,
  scrollIntoView,
}: LeaderboardRowProps) => {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (scrollIntoView) {
      const row = ref.current;
      if (!row) {
        return;
      }
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Remove `.flash` in case it was already applied
      row.classList.remove(styles.flash);
      const observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
          row.classList.add(styles.flash);
          observer.disconnect();
        }
      });
      observer.observe(row);
    }
  }, [scrollIntoView]);

  return (
    <Link href={url} className={styles.row} ref={ref}>
      <span className={styles.position}>{position}</span>
      <Image
        src={image}
        width={36}
        height={36}
        quality={10}
        alt={`Profile picture for ${name}`}
        className={styles.profilePicture}
        unoptimized={isSrcAGif(image)}
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
