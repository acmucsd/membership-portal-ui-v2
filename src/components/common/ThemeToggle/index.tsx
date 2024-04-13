import MonitorIcon from '@/public/assets/icons/monitor.svg';
import MoonIcon from '@/public/assets/icons/moon.svg';
import SunIcon from '@/public/assets/icons/sun.svg';
import { useTheme } from 'next-themes';
import { useEffect, useId, useState } from 'react';
import styles from './style.module.scss';

const ThemeToggle = () => {
  const { theme = 'system', resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const lightId = `light${useId()}`;
  const systemId = `system${useId()}`;
  const darkId = `dark${useId()}`;

  const iconSize = 30;

  const themeToSwitch: Record<string, string> = {
    light: styles.switchOne,
    system: styles.switchTwo,
    dark: styles.switchThree,
  };

  const switchPos = themeToSwitch[theme];
  const currAltText = mounted ? `Icon representing ${theme} theme is on.` : '';

  useEffect(() => {
    // Adjusting the <meta name="theme-color"> tag.
    // This affects the color of the safe zone on iPhone 15.
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor && resolvedTheme === 'dark') {
      metaThemeColor.setAttribute('content', '#37393e');
    } else if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#fff');
    }
  }, [resolvedTheme]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          checked={theme === 'light'}
          onChange={() => setTheme('light')}
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
          checked={theme === 'system'}
          onChange={() => setTheme('system')}
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
          checked={theme === 'dark'}
          onChange={() => setTheme('dark')}
        />
      </label>
      {mounted ? <div className={`${switchPos} ${styles.switchindicator}`} /> : null}
    </form>
  );
};
export default ThemeToggle;

// Links for knowledge:
// https://stackoverflow.com/questions/71039088/what-is-onchange-e-setnamee-target-value-in-react-mean
// https://css-tricks.com/the-sass-ampersand/
// https://www.npmjs.com/package/next-themes
// https://medium.com/geekculture/making-life-easier-with-absolute-imports-react-in-javascript-and-typescript-bbdab8a8a3a1
