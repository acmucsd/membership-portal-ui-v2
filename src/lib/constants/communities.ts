/* eslint-disable import/prefer-default-export */
import { Community } from '@/lib/types/enums';
import AILogo from '@/public/assets/acm-logos/communities/ai.png';
import CyberLogo from '@/public/assets/acm-logos/communities/cyber.png';
import DesignLogo from '@/public/assets/acm-logos/communities/design.png';
import HackLogo from '@/public/assets/acm-logos/communities/hack.png';
import ACMLogo from '@/public/assets/acm-logos/general/light-mode.png';
import type { StaticImageData } from 'next/image';

export const communityLogos: Record<Community, StaticImageData> = {
  Ai: AILogo,
  Cyber: CyberLogo,
  Design: DesignLogo,
  Hack: HackLogo,
  General: ACMLogo,
};

export const communityNames: Record<Community, string> = {
  Ai: 'ACM AI',
  Cyber: 'ACM Cyber',
  Design: 'ACM Design',
  Hack: 'ACM Hack',
  General: 'ACM',
};
