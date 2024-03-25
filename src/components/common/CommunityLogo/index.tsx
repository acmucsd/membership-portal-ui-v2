import { communityLogos } from '@/lib/constants/communities';
import { toCommunity } from '@/lib/utils';
import Image from 'next/image';

interface CommunityLogoProps {
  community: string;
  size: number;
}

const CommunityLogo = ({ community, size }: CommunityLogoProps) => {
  const name = toCommunity(community);
  return <Image src={communityLogos[name]} width={size} alt={`ACM ${name} Logo`} />;
};

export default CommunityLogo;
