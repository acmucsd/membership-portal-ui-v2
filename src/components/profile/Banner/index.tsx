import { UUID } from '@/lib/types';
import { PublicAttendance } from '@/lib/types/apiResponses';
import { Community } from '@/lib/types/enums';
import { seededRandom, shuffle, toCommunity } from '@/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './style.module.scss';

const communityColors: [Community, string][] = [
  [Community.HACK, styles.hack],
  [Community.AI, styles.ai],
  [Community.CYBER, styles.cyber],
  [Community.DESIGN, styles.design],
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

  return shuffle([...communityColors], random).map(([community, className]) => {
    const portion = communities[community] / total;
    if (portion === 0) {
      return { path: '', className };
    }

    const endAngle = angle + portion * Math.PI * 2;

    const path = [
      `M ${width / 2} ${height / 2}`,
      `L ${width / 2 + Math.cos(angle) * radius} ${height / 2 + Math.sin(angle) * radius}`,
      // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
      `A ${radius} ${radius} 0 0 1 ${width / 2 + Math.cos(endAngle) * radius} ${
        height / 2 + Math.sin(endAngle) * radius
      }`,
      'z',
    ].join('');

    angle = endAngle;
    return { path, className };
  });
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
      <filter id="blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation={blurRadius} />
      </filter>

      {slices.map(({ path, className }) =>
        path ? <path d={path} className={className} filter="url(#blur)" key={className} /> : null
      )}
    </svg>
  );
};

export default Banner;
