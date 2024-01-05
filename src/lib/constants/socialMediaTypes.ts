import { SocialMediaType } from '@/lib/types/enums';
import DevpostIcon from '@/public/assets/icons/devpost-icon.svg';
import { IconType } from 'react-icons';
import { AiOutlineLink } from 'react-icons/ai';
import { BsFacebook, BsGithub, BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';
import { IoMail } from 'react-icons/io5';

interface SocialMediaInfo {
  icon: IconType;
  label: string;
  domain?: string;
  example: string;
}

const socialMediaTypes: Record<SocialMediaType, SocialMediaInfo> = {
  [SocialMediaType.DEVPOST]: {
    icon: DevpostIcon,
    label: 'Devpost',
    domain: 'devpost.com',
    example: 'devpost.com/',
  },
  [SocialMediaType.EMAIL]: {
    icon: IoMail,
    label: 'Email',
    example: 'you@example.com',
  },
  [SocialMediaType.FACEBOOK]: {
    icon: BsFacebook,
    label: 'Facebook',
    domain: 'facebook.com',
    example: 'facebook.com/',
  },
  [SocialMediaType.GITHUB]: {
    icon: BsGithub,
    label: 'GitHub',
    domain: 'github.com',
    example: 'github.com/',
  },
  [SocialMediaType.INSTAGRAM]: {
    icon: BsInstagram,
    label: 'Instagram',
    domain: 'instagram.com',
    example: 'instagram.com/',
  },
  [SocialMediaType.LINKEDIN]: {
    icon: BsLinkedin,
    label: 'LinkedIn',
    domain: 'linkedin.com/in',
    example: 'linkedin.com/in/',
  },
  [SocialMediaType.PORTFOLIO]: {
    icon: AiOutlineLink,
    label: 'Portfolio',
    example: 'example.com',
  },
  [SocialMediaType.TWITTER]: {
    icon: BsTwitter,
    label: 'Twitter',
    domain: 'twitter.com',
    example: 'twitter.com/',
  },
};

export default socialMediaTypes;
