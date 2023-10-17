import Switch from '@mui/material/Switch';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// TODO: Replicate the current dark mode toggle with sun/moon images
const DarkModeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  const [toggled, setToggled] = useState(
    theme === 'system' ? systemTheme === 'dark' : theme === 'dark'
  );

  // when theme == system, system theme will be used to determine website theme
  useEffect(
    () => setToggled(theme === 'system' ? systemTheme === 'dark' : theme === 'dark'),
    [systemTheme, theme]
  );

  return (
    <Switch
      checked={toggled}
      onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      inputProps={{ 'aria-label': 'theme' }}
    />
  );
};

export default DarkModeToggle;
