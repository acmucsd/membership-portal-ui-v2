import { useTheme } from 'next-themes';
import { useEffect, useId, useState } from 'react';
import MonitorIcon from '../../../../public/assets/icons/monitor.svg';
import MoonIcon from '../../../../public/assets/icons/moon.svg';
import SunIcon from '../../../../public/assets/icons/sun.svg';
import styles from './style.module.scss';

const ThreeToggle = () => {
  //   const { theme = 'light', onThemeChange } = props;
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const lightId = `light${useId()}`;
  const systemId = `system${useId()}`;
  const darkId = `light${useId()}`;

  const lightIcon = '/assets/icons/sun.svg';
  const darkIcon = '/assets/icons/moon.svg';
  const systemIcon = '/assets/icons/monitor.svg';
  const iconSize = 30;

  // let switchStyle = styles.switchOne;
  // let currIcon = '/assets/icons/moon.svg';
  // let currAltText = 'Icon representing current theme';

  const calcIndicatorStyle = (newTheme: string | undefined) => {
    switch (newTheme) {
      case 'light':
        return styles.switchOne;
      case 'system':
        return styles.switchTwo;
      case 'dark':
        return styles.switchThree;
      default:
        console.log(newTheme);
        return styles.switchOne;
    }
  };

  const calcIconStyle = (newTheme: string | undefined) => {
    switch (newTheme) {
      case 'light':
        return styles.iconLightMode;
      case 'system':
        return systemTheme === 'light' ? styles.iconLightMode : styles.iconDarkMode;
      case 'dark':
        return styles.iconDarkMode;
      default:
        console.log(newTheme);
        return styles.iconDarkMode;
    }
  };

  // const calcIcon = (theme: string | undefined) => {
  //   switch (theme) {
  //     case 'light':
  //       return lightIcon;
  //     case 'system':
  //       return systemIcon;
  //     case 'dark':
  //       return darkIcon;
  //     default:
  //       return darkIcon;
  //   }
  // };

  const calcAltText = (theme: string | undefined) => {
    switch (theme) {
      case 'light':
        return 'Icon representing light theme is on';
      case 'system':
        return 'Icon representing system theme is on';
      case 'dark':
        return 'Icon representing dark theme is on';
      default:
        return 'Icon representing dark theme is on';
    }
  };

  const switchStyle = calcIndicatorStyle(theme);
  const currAltText = calcAltText(theme);
  const iconStyle = calcIconStyle(theme);
  // const currIcon = calcIcon(theme);

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
        <svg className={`${styles.icon} ${iconStyle}`}>
          <SunIcon
            // src={lightIcon}
            alt={currAltText}
            width={iconSize}
            height={iconSize}
            // className={styles.icon}
          />
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
        <svg className={`${styles.icon} ${iconStyle}`}>
          <MonitorIcon
            // src={systemIcon}
            alt={currAltText}
            width={iconSize}
            height={iconSize}
            // className={styles.icon}
          />
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
        <svg className={`${styles.icon} ${iconStyle}`}>
          <MoonIcon
            // src={darkIcon}
            alt={currAltText}
            width={iconSize}
            height={iconSize}
            // className={styles.icon}
          />
        </svg>

        <input
          id={darkId}
          name="state-d"
          type="radio"
          defaultChecked={theme === 'dark'}
          onClick={() => setTheme('dark')}
        />
      </label>
      <div className={`${switchStyle} ${styles.switchindicator}`}>
        {/* <Image
          src={currIcon}
          alt={currAltText}
          width={iconSize}
          height={iconSize}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '10px',
            paddingLeft: '10px',
          }}
        /> */}
      </div>
    </form>
  );
};
export default ThreeToggle;

// Links for knowledge:
// https://stackoverflow.com/questions/71039088/what-is-onchange-e-setnamee-target-value-in-react-mean
// https://css-tricks.com/the-sass-ampersand/
// https://www.npmjs.com/package/next-themes
