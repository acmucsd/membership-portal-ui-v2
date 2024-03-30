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

  // const el = document.querySelector('.switch');

  // el?.addEventListener('transitionstart', () => {
  //   const css = document.createElement('style');
  //   setId(css.id);
  //   css.appendChild(
  //     document.createTextNode(
  //       `* {
  //                 webkit-transition: 0.3s ease-in-out !important;
  //                 -moz-transition: 0.3s ease-in-out !important;
  //                 -o-transition: 0.3s ease-in-out !important;
  //                 -ms-transition: 0.3s ease-in-out !important;
  //                 transition: 0.3s ease-in-out !important;
  //               }`
  //     )
  //   );
  //   document.head.appendChild(css);
  // });

  // el?.addEventListener('transitioncancel', () => {
  //   const css = document.getElementById(id);
  //   // Calling getComputedStyle forces the browser to redraw
  //   // eslint-disable-next-line no-unused-vars
  //   const _ = window.getComputedStyle(css).opacity;

  //   document.head.removeChild(css);
  // });

  // el?.addEventListener('transitionend', () => {
  //   // Calling getComputedStyle forces the browser to redraw
  //   // eslint-disable-next-line no-unused-vars
  //   const _ = window.getComputedStyle(css).opacity;

  //   document.head.removeChild(css);
  // });

  const switchPos = themeToSwitch[theme];
  const currAltText = `Icon representing ${theme} theme is on.`;

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
          onClick={() => {
            // const css = document.createElement('style');
            // css.type = 'text/css';
            // css.appendChild(
            //   document.createTextNode(
            //     `* {
            //       -webkit-transition: all 0s, color 0.3s !important;
            //       -moz-transition: all 0s, color 0.3s !important;
            //       -o-transition: all 0s, color 0.3s !important;
            //       -ms-transition: all 0s, color 0.3s !important;
            //       transition: all 0s, color 0.3s !important;
            //     }`
            //   )
            // );
            // document.head.appendChild(css);
            // // Toggle the theme here...

            // // Calling getComputedStyle forces the browser to redraw
            // // eslint-disable-next-line no-unused-vars
            // const _ = window.getComputedStyle(css).opacity;
            // document.head.removeChild(css);

            setTheme('light');
          }}
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
          onClick={() => {
            // const css = document.createElement('style');
            // css.type = 'text/css';
            // css.appendChild(
            //   document.createTextNode(
            //     `* {
            //       -webkit-transition: all 0s, color 0.3s !important;
            //       -moz-transition: all 0s, color 0.3s !important;
            //       -o-transition: all 0s, color 0.3s !important;
            //       -ms-transition: all 0s, color 0.3s !important;
            //       transition: all 0s, color 0.3s !important;
            //     }`
            //   )
            // );
            // document.head.appendChild(css);
            // // Toggle the theme here...

            // // Calling getComputedStyle forces the browser to redraw
            // // eslint-disable-next-line no-unused-vars
            // const _ = window.getComputedStyle(css).opacity;
            // document.head.removeChild(css);

            setTheme('system');
          }}
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
          onClick={() => {
            // const css = document.createElement('style');
            // css.type = 'text/css';
            // css.appendChild(
            //   document.createTextNode(
            //     `* {
            //       -webkit-transition: all 0s, color 0.3s !important;
            //       -moz-transition: all 0s, color 0.3s !important;
            //       -o-transition: all 0s, color 0.3s !important;
            //       -ms-transition: all 0s, color 0.3s !important;
            //       transition: all 0s, color 0.3s !important;
            //     }`
            //   )
            // );
            // document.head.appendChild(css);
            // // Toggle the theme here...

            // // Calling getComputedStyle forces the browser to redraw
            // // eslint-disable-next-line no-unused-vars
            // const _ = window.getComputedStyle(css).opacity;
            // document.head.removeChild(css);

            setTheme('dark');
          }}
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
