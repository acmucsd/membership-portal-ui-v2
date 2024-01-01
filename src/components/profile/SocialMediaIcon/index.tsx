import { SocialMediaType } from '@/lib/types/enums';
import DevpostIcon from '@/public/assets/icons/devpost-icon.svg';
import { IconType } from 'react-icons';
import { AiOutlineLink } from 'react-icons/ai';
import { BsFacebook, BsGithub, BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';
import { IoMail } from 'react-icons/io5';
import styles from './style.module.scss';

const socialMediaTypes: Record<SocialMediaType, { icon: IconType; label: string }> = {
  [SocialMediaType.DEVPOST]: { icon: DevpostIcon, label: 'Devpost' },
  [SocialMediaType.EMAIL]: { icon: IoMail, label: 'Email' },
  [SocialMediaType.FACEBOOK]: { icon: BsFacebook, label: 'Facebook' },
  [SocialMediaType.GITHUB]: { icon: BsGithub, label: 'GitHub' },
  [SocialMediaType.INSTAGRAM]: { icon: BsInstagram, label: 'Instagram' },
  [SocialMediaType.LINKEDIN]: { icon: BsLinkedin, label: 'LinkedIn' },
  [SocialMediaType.PORTFOLIO]: { icon: AiOutlineLink, label: 'Portfolio' },
  [SocialMediaType.TWITTER]: { icon: BsTwitter, label: 'Twitter' },
};

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
