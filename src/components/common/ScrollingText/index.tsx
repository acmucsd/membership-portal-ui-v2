import { CSSProperties, PropsWithChildren, useEffect, useState } from 'react';
import styles from './style.module.scss';

// scroll speed in px per second
const VELOCITY = 50;

/**
 * Make text scroll when it overflows.
 */
const ScrollingText = ({ children }: PropsWithChildren) => {
  const [overflowAmount, setOverflowAmount] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => setOverflowAmount(contentWidth - containerWidth), [contentWidth, containerWidth]);

  return (
    <div
      ref={node => setContainerWidth(node?.offsetWidth ?? 0)}
      className={overflowAmount > 0 ? styles.overflowing : ''}
      // calculate animation time accounting for 2rem gap
      style={{ '--anim-time': `${(contentWidth + 32) / VELOCITY}s` } as CSSProperties}
    >
      <div className={styles.window}>
        <div className={styles.slider}>
          <div ref={node => setContentWidth(node?.offsetWidth ?? 0)}>{children}</div>
          {overflowAmount > 0 && <div>{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default ScrollingText;
