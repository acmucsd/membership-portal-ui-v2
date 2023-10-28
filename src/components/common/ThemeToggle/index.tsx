import MonitorIcon from '@/public/assets/icons/monitor.svg';
import MoonIcon from '@/public/assets/icons/moon.svg';
import SunIcon from '@/public/assets/icons/sun.svg';
import { useTheme } from 'next-themes';
import { useEffect, useId, useState } from 'react';
import styles from './style.module.scss';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const lightId = `light${useId()}`;
  const systemId = `system${useId()}`;
  const darkId = `dark${useId()}`;

  const iconSize = 30;

  const indicatorText = styles[theme]
    switch (newTheme) {
      case 'light':
        return styles.switchOne;
      case 'system':
        return styles.switchTwo;
      case 'dark':
        return styles.switchThree;
      default:
        return styles.switchOne;
    }
  };

  const switchPos = calcIndicatorStyle(theme);
  const currAltText = `Icon representing ${theme} theme is on.`;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <form className={styles.switch}>
      <label htmlFor={lightId}>
        {/* LIGHT */}
        <svg className={`${styles.icon}`}>
          <SunIcon alt={currAltText} width={iconSize} height={iconSize} />
        </svg>

        <input
          id={lightId}
          name="state-d"
          type="radio"
          defaultChecked={theme === 'light'}
          onClick={() => setTheme('light')}
        />
      </label>

      <label htmlFor={systemId}>
        {/* SYSTEM */}
        <svg className={`${styles.icon}`}>
          <MonitorIcon alt={currAltText} width={iconSize} height={iconSize} />
        </svg>

        <input
          id={systemId}
          name="state-d"
          type="radio"
          defaultChecked={theme === 'system'}
          onClick={() => setTheme('system')}
        />
      </label>

      <label htmlFor={darkId}>
        {/* DARK */}
        <svg className={`${styles.icon} `}>
          <MoonIcon alt={currAltText} width={iconSize} height={iconSize} />
        </svg>

        <input
          id={darkId}
          name="state-d"
          type="radio"
          defaultChecked={theme === 'dark'}
          onClick={() => setTheme('dark')}
        />
      </label>
      <div className={`${switchPos} ${styles.switchindicator}`} />
    </form>
  );
};
export default ThemeToggle;

// Links for knowledge:
// https://stackoverflow.com/questions/71039088/what-is-onchange-e-setnamee-target-value-in-react-mean
// https://css-tricks.com/the-sass-ampersand/
// https://www.npmjs.com/package/next-themes
// https://medium.com/geekculture/making-life-easier-with-absolute-imports-react-in-javascript-and-typescript-bbdab8a8a3a1
