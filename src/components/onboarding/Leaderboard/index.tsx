import { LeaderboardRow } from '@/components/leaderboard';
import defaultProfilePictures from '@/lib/constants/profilePictures';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { getProfilePicture, getUserRank } from '@/lib/utils';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';

const dummyUsers = [
  'Emily Nguyen',
  'Casey Price',
  'Stanley Lee',
  'Shirley Qi',
  'Nishant Balaji',
  'Murou Wang',
];

const ANIM_TIME = 2000;

interface LeaderboardUser {
  name: string;
  points: number;
  image: string;
}

interface LeaderboardProps {
  user: PrivateProfile;
}

const Leaderboard = ({ user }: LeaderboardProps) => {
  const [points, setPoints] = useState(0);

  const userName = `${user.firstName} ${user.lastName}`;
  const userPoints = Math.max(user.points, 20);
  const users: LeaderboardUser[] = [
    {
      name: userName,
      points,
      image: getProfilePicture(user),
    },
    ...dummyUsers
      .filter(name => name !== userName)
      .map((name, i) => ({
        name,
        points: Math.ceil(userPoints * (1 - i / dummyUsers.length) - 1),
        image: defaultProfilePictures[i]?.src ?? '',
      })),
  ];
  const sorted = [...users].sort((a, b) => b.points - a.points).map(({ name }) => name);

  useEffect(() => {
    const start = Date.now();

    let frameId: number;
    const paint = () => {
      let time = (Date.now() - start) / ANIM_TIME;
      if (time >= 1) {
        setPoints(userPoints);
        return;
      }

      // cubic ease out
      time = (time - 1) ** 3 + 1;

      setPoints(Math.round(time * userPoints));

      frameId = window.requestAnimationFrame(paint);
    };
    frameId = window.requestAnimationFrame(paint);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [userPoints]);

  return (
    <div
      className={styles.wrapper}
      style={{ height: `calc(${users.length} * var(--leaderboard-height))`
    }}>
      {users.map(({ name, points, image }) => {
        const position = sorted.indexOf(name);
        return (
          <LeaderboardRow
            key={name}
            position={position + 1}
            rank={getUserRank(points)}
            name={name}
            points={points}
            image={image}
            even={name !== userName}
            className={styles.row}
            style={{
              transform: `translateY(${position * 4}rem)`,
              zIndex: name === userName ? '5' : undefined,
            }}
          />
        );
      })}
    </div>
  );
};

export default Leaderboard;
