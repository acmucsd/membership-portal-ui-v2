import { GifSafeImage } from '@/components/common';
import Link from 'next/link';
import { CSSProperties, useEffect, useRef } from 'react';
import styles from './style.module.scss';

interface LeaderboardRowProps {
  position: number;
  rank: string;
  name: string;
  url?: string;
  points: number;
  image: string;
  even: boolean;
  match?: {
    index: number;
    length: number;
  };
  scrollIntoView?: number;
  className?: string;
  style?: CSSProperties;
}

const LeaderboardRow = ({
  position,
  rank,
  name,
  url,
  points,
  image,
  even,
  match,
  scrollIntoView = 0,
  className = '',
  style,
}: LeaderboardRowProps) => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (scrollIntoView > 0) {
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

  const Component = url ? Link : 'div';

  return (
    <Component
      href={url ?? ''}
      className={`${styles.row} ${even ? styles.even : ''} ${className}`}
      style={style}
      ref={(element: HTMLAnchorElement | HTMLDivElement | null) => {
        ref.current = element;
      }}
    >
      <span className={styles.position}>{position}</span>
      <GifSafeImage
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
    </Component>
  );
};

export default LeaderboardRow;
