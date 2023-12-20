import Image from 'next/image';

import AILogo from '@/public/assets/acm-logos/communities/ai.png';
import CyberLogo from '@/public/assets/acm-logos/communities/cyber.png';
import DesignLogo from '@/public/assets/acm-logos/communities/design.png';
import HackLogo from '@/public/assets/acm-logos/communities/hack.png';
import ACMLogo from '@/public/assets/acm-logos/general/light-mode.png';

interface CommunityLogoProps {
  community: string;
  width: number;
}

const CommunityLogo = ({ community, width }: CommunityLogoProps) => {
  switch (community.toLowerCase()) {
    case 'hack':
      return <Image src={HackLogo} width={width} alt="ACM Hack Logo" />;
    case 'ai':
      return <Image src={AILogo} width={width} alt="ACM AI Logo" />;
    case 'cyber':
      return <Image src={CyberLogo} width={width} alt="ACM Cyber Logo" />;
    case 'design':
      return <Image src={DesignLogo} width={width} alt="ACM Design Logo" />;
    default:
      return <Image src={ACMLogo} width={width} alt="ACM General Logo" />;
  }
};

export default CommunityLogo;
