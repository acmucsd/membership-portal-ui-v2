import socialMediaTypes from '@/lib/constants/socialMediaTypes';
import { SocialMediaType } from '@/lib/types/enums';
import styles from './style.module.scss';

interface SocialMediaIconProps {
  type: SocialMediaType;
  hidden?: boolean;
}

const SocialMediaIcon = ({ type, hidden }: SocialMediaIconProps) => {
  const { icon: Icon, label } = socialMediaTypes[type];
  return (
    <Icon className={styles.icon} aria-label={hidden ? undefined : label} aria-hidden={hidden} />
  );
};

export default SocialMediaIcon;
