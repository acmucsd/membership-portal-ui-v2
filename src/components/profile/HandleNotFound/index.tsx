import { SignInButton } from '@/components/auth';
import { Typography, VerticalForm } from '@/components/common';
import Cat404 from '@/public/assets/graphics/cat404.png';
import Image from 'next/image';

export interface HandleNotFoundProps {
  handle: string;
}

export const HandleNotFound = ({ handle }: HandleNotFoundProps) => (
  <VerticalForm style={{ alignItems: 'center', margin: 'auto' }}>
    <Typography variant="h1/medium" style={{ textAlign: 'center' }}>
      No user with handle &lsquo;{handle}&rsquo; was found.
    </Typography>
    <Image src={Cat404} width={256} height={256} alt="Sad Cat" />
    <SignInButton type="link" display="button1" href="/" text="Return to Home" />
  </VerticalForm>
);
