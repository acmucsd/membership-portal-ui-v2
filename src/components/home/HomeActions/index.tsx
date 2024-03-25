import { Typography } from '@/components/common';
import { UserProgress } from '@/components/profile/UserProgress';
import { PrivateProfile } from '@/lib/types/apiResponses';
import CheckMark from '@/public/assets/icons/check-mark.svg';
import { FormEvent, useState } from 'react';
import styles from './style.module.scss';

interface HomeActionsProps {
  user: PrivateProfile;
  points: number;
  checkin: (code: string) => void;
}

const HomeActions = ({ user, points, checkin }: HomeActionsProps) => {
  const [checkinCode, setCheckinCode] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (checkinCode !== '') {
      checkin(checkinCode);
    }
  };

  return (
    <div className={styles.actions}>
      <form className={styles.checkin} onSubmit={handleSubmit} action="">
        <Typography variant="h2/bold" className={styles.subheading}>
          Event Check-in
        </Typography>
        <div className={styles.checkinButtons}>
          <input
            type="text"
            placeholder="Enter event check-in code"
            className={styles.checkinInput}
            value={checkinCode}
            onChange={e => setCheckinCode(e.target.value)}
          />
          <button type="submit" className={styles.submit}>
            <CheckMark />
          </button>
        </div>
      </form>
      <div className={styles.userProgress}>
        <UserProgress user={user} points={points} isSignedInUser />
      </div>
    </div>
  );
};

export default HomeActions;
