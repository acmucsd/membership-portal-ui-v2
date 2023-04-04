import Switch from '@mui/material/Switch';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// TODO: Replicate the current dark mode toggle with sun/moon images
const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [toggled, setToggled] = useState(false);
  useEffect(() => setToggled(theme === 'dark'), [theme]);

  return (
    <Switch checked={toggled} onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
  );
};

export default DarkModeToggle;
