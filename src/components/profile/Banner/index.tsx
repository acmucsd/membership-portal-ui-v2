import { UUID } from '@/lib/types';
import { PublicAttendance } from '@/lib/types/apiResponses';
import { Community } from '@/lib/types/enums';
import { seededRandom, toCommunity } from '@/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './style.module.scss';

const communityColors: [Community, string][] = [
  [Community.DESIGN, styles.design],
  [Community.CYBER, styles.cyber],
  [Community.HACK, styles.hack],
  [Community.AI, styles.ai],
  [Community.GENERAL, styles.general],
];

type PieSlice = {
  path: string;
  className: string;
};

function computePie(
  uuid: UUID,
  recentAttendances: PublicAttendance[],
  width: number,
  height: number
): PieSlice[] {
  if (width === 0 && height === 0) {
    return [];
  }

  const hex = uuid.replaceAll('-', '');
  const random = seededRandom(
    parseInt(hex.slice(0, 8), 16),
    parseInt(hex.slice(8, 16), 16),
    parseInt(hex.slice(16, 24), 16),
    parseInt(hex.slice(24, 32), 16)
  );

  const communities: Record<Community, number> = {
    [Community.HACK]: 0,
    [Community.AI]: 0,
    [Community.CYBER]: 0,
    [Community.DESIGN]: 0,
    [Community.GENERAL]: 0,
  };
  let total = 0;

  recentAttendances.forEach(({ event: { committee } }) => {
    const community = toCommunity(committee);
    communities[community] += 1;
    total += 1;
  });

  const radius = Math.hypot(width / 2, height / 2);
  let angle = random() * Math.PI * 2;

  return (
    communityColors
      .map(([community, className]) => {
        const portion = communities[community] / total;
        if (portion === 0) {
          return { path: '', className, portion };
        }
        if (portion === 1) {
          // Draw a circle
          return {
            path: [
              `M ${width / 2 - radius} ${height / 2}`,
              `A ${radius} ${radius} 0 0 0 ${width / 2 + radius} ${height / 2}`,
              `A ${radius} ${radius} 0 0 0 ${width / 2 - radius} ${height / 2}`,
              'z',
            ].join(''),
            className,
            portion,
          };
        }

        const endAngle = angle + portion * Math.PI * 2;

        const path = [
          `M ${width / 2} ${height / 2}`,
          `L ${width / 2 + Math.cos(angle) * radius} ${height / 2 + Math.sin(angle) * radius}`,
          // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
          `A ${radius} ${radius} 0 ${portion > 0.5 ? 1 : 0} 1 ${
            width / 2 + Math.cos(endAngle) * radius
          } ${height / 2 + Math.sin(endAngle) * radius}`,
          'z',
        ].join('');

        angle = endAngle;
        return { path, className, portion };
      })
      // Make the biggest blobs fade in first
      .sort((a, b) => b.portion - a.portion)
  );
}

interface BannerProps {
  uuid: UUID;
  recentAttendances: PublicAttendance[];
}

const Banner = ({ uuid, recentAttendances }: BannerProps) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const size = entries[0]?.borderBoxSize[0];
      if (size) {
        setWidth(size.inlineSize);
        setHeight(size.blockSize);
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  });

  const slices = useMemo(
    () => computePie(uuid, recentAttendances, width, height),
    [uuid, recentAttendances, width, height]
  );
  const blurRadius = useMemo(() => Math.hypot(width / 2, height / 2) / 4, [width, height]);

  return (
    <svg ref={ref} className={styles.banner}>
      {/* Avoid clipping off the blur: https://stackoverflow.com/a/6556655 */}
      <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation={blurRadius} />
      </filter>

      {slices.map(({ path, className }, i) =>
        path ? (
          <path
            d={path}
            className={`${styles.path} ${className}`}
            filter="url(#blur)"
            style={{ animationDelay: `${i * 0.7 + 0.5}s` }}
            key={className}
          />
        ) : null
      )}
    </svg>
  );
};

export default Banner;
