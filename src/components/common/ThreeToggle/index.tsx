import { useTheme } from 'next-themes';
import { useId } from 'react';
import styles from './style.module.scss';

// interface ThreeToggleProps {
//   theme?: string;
//   onThemeChange: MouseEventHandler<HTMLInputElement>;
// }

// props: PropsWithChildren<ThreeToggleProps>

const ThreeToggle = () => {
  //   const { theme = 'light', onThemeChange } = props;
  const { theme, setTheme, systemTheme } = useTheme();

  const lightId = `light${useId()}`;
  const systemId = `system${useId()}`;
  const darkId = `light${useId()}`;

  return (
    <form className={styles.switch}>
      <div className={`${styles.switchindicator}`}>
        <label htmlFor={lightId} className={styles.light}>
          LIGHT
          <input
            className={styles.one}
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

        <label htmlFor={systemId} className={styles.system}>
          SYSTEM
          <input
            className={styles.two}
            id={systemId}
            name="state-d"
            type="radio"
            defaultChecked={theme === 'system'}
            onClick={() => setTheme('system')}
          />
        </label>

        <label htmlFor={darkId} className={styles.dark}>
          DARK
          <input
            className={styles.three}
            id={darkId}
            name="state-d"
            type="radio"
            defaultChecked={theme === 'dark'}
            onClick={() => setTheme('dark')}
          />
        </label>
      </div>
    </form>
  );
};
export default ThreeToggle;

// Links for knowledge:
// https://stackoverflow.com/questions/71039088/what-is-onchange-e-setnamee-target-value-in-react-mean
// https://css-tricks.com/the-sass-ampersand/
