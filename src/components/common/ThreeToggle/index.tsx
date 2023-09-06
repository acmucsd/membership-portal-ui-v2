import { useTheme } from 'next-themes';
import Image from 'next/image';
// import moon from '../../../../public/assets/icons/moon.svg';
// import sun from '../../../../public/assets/icons/sun.svg';
import { useEffect, useId, useState } from 'react';
import styles from './style.module.scss';

// interface ThreeToggleProps {
//   theme?: string;
//   onThemeChange: MouseEventHandler<HTMLInputElement>;
// }

// props: PropsWithChildren<ThreeToggleProps>

const ThreeToggle = () => {
  //   const { theme = 'light', onThemeChange } = props;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // const [switchStyle, setSwitchStyle] = useState(styles.switchOne);
  // const [currAltText, setCurrAltText] = useState('Icon representing current theme');
  // const [currIcon, setCurrIcon] = useState('/assets/icons/moon.svg');

  const lightId = `light${useId()}`;
  const systemId = `system${useId()}`;
  const darkId = `light${useId()}`;

  // let switchStyle = styles.switchOne;
  // let currIcon = '/assets/icons/moon.svg';
  // let currAltText = 'Icon representing current theme';

  const calcStyle = (newTheme: string | undefined) => {
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

  const calcIcon = (theme: string | undefined) => {
    switch (theme) {
      case 'light':
        return '/assets/icons/sun.svg';
      case 'system':
        return '/assets/icons/moon.svg';
      case 'dark':
        return '/assets/icons/moon.svg';
      default:
        return '/assets/icons/moon.svg';
    }
  };

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

  // const switchStyle = useMemo(() => calcStyle(theme), [theme]);
  // const currAltText = useMemo(() => calcAltText(theme), [theme]);
  // const currIcon = useMemo(() => calcIcon(theme), [theme]);

  const switchStyle = calcStyle(theme);
  const currAltText = calcAltText(theme);
  const currIcon = calcIcon(theme);

  useEffect(() => {
    setMounted(true);
  }, []);

  // useEffect(() => {
  //   switch (theme) {
  //     case 'light':
  //       setSwitchStyle(styles.switchOne);
  //       setCurrIcon('/assets/icons/sun.svg');
  //       setCurrAltText('Icon representing light theme is on');
  //       break;
  //     case 'system':
  //       setSwitchStyle(styles.switchTwo);
  //       setCurrAltText('Icon representing system theme is on');
  //       break;
  //     case 'dark':
  //       setSwitchStyle(styles.switchThree);
  //       setCurrAltText('Icon representing dark theme is on');
  //       setCurrIcon('/assets/icons/moon.svg');
  //       break;
  //     default:
  //       setSwitchStyle(styles.switchOne);
  //       console.log(theme);
  //       break;
  //   }
  // }, [theme]);

  if (!mounted) {
    return null;
  }

  return (
    <form className={styles.switch}>
      <label htmlFor={lightId}>
        LIGHT
        <input
          id={lightId}
          name="state-d"
          type="radio"
          defaultChecked={theme === 'light'}
          onClick={() => setTheme('light')}
        />
        {/* <div>
            <span className={`${styles.slider} ${styles.round}`} />
          </div> */}
      </label>

      <label htmlFor={systemId}>
        SYSTEM
        <input
          id={systemId}
          name="state-d"
          type="radio"
          defaultChecked={theme === 'system'}
          onClick={() => setTheme('system')}
        />
      </label>

      <label htmlFor={darkId}>
        DARK
        <input
          id={darkId}
          name="state-d"
          type="radio"
          defaultChecked={theme === 'dark'}
          onClick={() => setTheme('dark')}
        />
      </label>
      <div className={`${switchStyle} ${styles.switchindicator}`}>
        <Image src={currIcon} alt={currAltText} width={50} height={50} />
      </div>
    </form>
  );
};
export default ThreeToggle;

// Links for knowledge:
// https://stackoverflow.com/questions/71039088/what-is-onchange-e-setnamee-target-value-in-react-mean
// https://css-tricks.com/the-sass-ampersand/
// https://www.npmjs.com/package/next-themes
