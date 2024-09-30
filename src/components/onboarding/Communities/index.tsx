import LogoAi from '@/public/assets/acm-logos/communities/ai.svg';
import LogoCyber from '@/public/assets/acm-logos/communities/cyber.svg';
import LogoDesign from '@/public/assets/acm-logos/communities/design.svg';
import LogoHack from '@/public/assets/acm-logos/communities/hack.svg';
import { ComponentType, SVGAttributes } from 'react';
import styles from './style.module.scss';

interface Community {
  name: string;
  description: string;
  logo: ComponentType<SVGAttributes<SVGSVGElement>>;
}

const communities: Community[] = [
  { name: 'AI', description: 'Artificial Intelligence', logo: LogoAi },
  { name: 'Hack', description: 'Software Engineering', logo: LogoHack },
  { name: 'Cyber', description: 'Cyber Security', logo: LogoCyber },
  { name: 'Design', description: 'Design', logo: LogoDesign },
];

const Communities = () => {
  return (
    <div className={styles.wrapper}>
      {communities.map(({ name, description, logo: Logo }, i) => (
        <div className={styles.community} style={{ animationDelay: `${i * 0.1}s` }} key={name}>
          {/* HACK: Our SVG importer removes viewBox for some reason */}
          <Logo className={styles.logo} viewBox="0 0 1007 1007" />
          <div className={styles.name}>
            <strong>ACM</strong> {name}
          </div>
          <div className={styles.description}>{description}</div>
        </div>
      ))}
    </div>
  );
};

export default Communities;
