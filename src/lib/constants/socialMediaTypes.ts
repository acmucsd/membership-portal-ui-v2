import { SocialMediaType } from '@/lib/types/enums';
import DevpostIcon from '@/public/assets/icons/devpost-icon.svg';
import EmailIcon from '@/public/assets/icons/email-solid.svg';
import FacebookIcon from '@/public/assets/icons/facebook-icon.svg';
import GithubIcon from '@/public/assets/icons/github-icon.svg';
import InstagramIcon from '@/public/assets/icons/instagram.svg';
import LinkIcon from '@/public/assets/icons/link-icon.svg';
import LinkedInIcon from '@/public/assets/icons/linkedin-icon.svg';
import TwitterIcon from '@/public/assets/icons/twitter.svg';
import { ComponentType, SVGProps } from 'react';

interface SocialMediaInfo {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
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
    icon: EmailIcon,
    label: 'Email',
    example: 'you@example.com',
  },
  [SocialMediaType.FACEBOOK]: {
    icon: FacebookIcon,
    label: 'Facebook',
    domain: 'facebook.com',
    example: 'facebook.com/',
  },
  [SocialMediaType.GITHUB]: {
    icon: GithubIcon,
    label: 'GitHub',
    domain: 'github.com',
    example: 'github.com/',
  },
  [SocialMediaType.INSTAGRAM]: {
    icon: InstagramIcon,
    label: 'Instagram',
    domain: 'instagram.com',
    example: 'instagram.com/',
  },
  [SocialMediaType.LINKEDIN]: {
    icon: LinkedInIcon,
    label: 'LinkedIn',
    domain: 'linkedin.com/in',
    example: 'linkedin.com/in/',
  },
  [SocialMediaType.PORTFOLIO]: {
    icon: LinkIcon,
    label: 'Portfolio',
    example: 'example.com',
  },
  [SocialMediaType.TWITTER]: {
    icon: TwitterIcon,
    label: 'Twitter',
    domain: 'twitter.com',
    example: 'twitter.com/',
  },
};

export default socialMediaTypes;
