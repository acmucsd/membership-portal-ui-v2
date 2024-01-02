import { communityLogos } from '@/lib/constants/communityLogos';
import { Community } from '@/lib/types/enums';
import { capitalize } from '@/lib/utils';
import Image from 'next/image';

interface CommunityLogoProps {
  community: string;
  size: number;
}

const CommunityLogo = ({ community, size }: CommunityLogoProps) => {
  const formattedName = capitalize(community) as Community;

  if (!Object.values(Community).includes(formattedName))
    return <Image src={communityLogos.General} width={size} alt="ACM General Logo" />;

  return (
    <Image src={communityLogos[formattedName]} width={size} alt={`ACM ${formattedName} Logo`} />
  );
};

export default CommunityLogo;
