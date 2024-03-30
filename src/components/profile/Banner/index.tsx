import { PublicAttendance } from '@/lib/types/apiResponses';
import { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';

interface BannerProps {
  recentAttendances: PublicAttendance[];
}

const Banner = ({ recentAttendances }: BannerProps) => {
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

  return (
    <svg ref={ref} className={styles.banner}>
      <rect x={0} y={0} width={width} height={height} />
      {recentAttendances.length}
    </svg>
  );
};

export default Banner;
