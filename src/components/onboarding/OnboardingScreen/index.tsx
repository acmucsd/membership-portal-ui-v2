import { Button, LinkButton, Typography } from '@/components/common';
import { Events, Store } from '@/components/onboarding/AnnotatedSite';
import Communities from '@/components/onboarding/Communities';
import Intro from '@/components/onboarding/Intro';
import Leaderboard from '@/components/onboarding/Leaderboard';
import { config } from '@/lib';
import { PrivateProfile } from '@/lib/types/apiResponses';
import Step4 from '@/public/assets/graphics/store/step4.svg';
import { ComponentType, Fragment, useState } from 'react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import styles from './style.module.scss';

type Step = {
  title: string;
  caption: string;
  content: ComponentType<{ user: PrivateProfile }>;
};

const steps: Step[] = [
  {
    title: 'Welcome to the ACM at UCSD!',
    caption:
      'The Association of Computing Machinery (ACM) is UCSD’s largest computing organization! Our goal is to establish and foster an inclusive member-first community for all who are interested in the field of computing.',
    content: Intro,
  },
  {
    title: 'Find your niche here.',
    caption:
      'We have a space for you! Pursue your interests by exploring different communities such as ACM AI, ACM Hack, ACM Cyber, and ACM Design.',
    content: Communities,
  },
  {
    title: 'Join us at our events and workshops.',
    caption:
      'Learn technical skills and connect with other members with shared interests. We can’t wait to see you there!',
    content: () => (
      <>
        <div className={styles.rainbow} />
        <Events />
      </>
    ),
  },
  {
    title: 'Race your friends to the top of the leaderboard',
    caption: 'Each point you gain allows you to level up and rise up in the ranks!',
    content: Leaderboard,
  },
  {
    title: 'Redeem your points at the ACM Store!',
    caption: 'Purchase merch with your points and show off your ACM spirit!',
    content: () => (
      <>
        <div className={styles.rainbow} />
        <Store />
      </>
    ),
  },
  {
    title: 'That’s a glimpse on how we run ACM at UCSD.',
    caption: 'Let’s get started with setting up your account!', // You can earn your first 10 points by completing the tasks under the profile dashboard.
    content: () => <Step4 className={styles.endImage} />,
  },
];

const TOTAL_STEPS = steps.length - 1;

interface OnboardingScreenProps {
  user: PrivateProfile;
  onDismiss: () => void;
  onFinish?: () => void;
}

const OnboardingScreen = ({ user, onDismiss, onFinish }: OnboardingScreenProps) => {
  const [step, setStep] = useState(0);

  const {
    title,
    caption,
    content: Component,
  } = steps[step] ?? { title: 'Unknown step', caption: '', content: Fragment };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={`${styles.progress} ${step > 0 ? styles.showProgress : ''}`}>
          <div className={styles.progressBar} style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
        {step === 0 ? <AiOutlineClockCircle className={styles.clockIcon} /> : null}
        {step > 0 ? (
          <p>
            {step} of {TOTAL_STEPS}
          </p>
        ) : (
          <p>Estimated time of onboarding: 2 minutes</p>
        )}
      </div>
      <Typography variant="h2/bold" component="h2" className={styles.title}>
        {title}
      </Typography>
      <div className={styles.content}>
        <Component user={user} />
      </div>
      <Typography variant="h5/regular" component="p" className={styles.caption}>
        {caption}
      </Typography>
      <div className={styles.buttonRow}>
        <Button
          variant="secondary"
          onClick={step > 0 ? () => setStep(step => step - 1) : onDismiss}
        >
          {step > 0 ? 'Back' : 'Maybe later'}
        </Button>
        {!onFinish && step === steps.length - 1 ? (
          <LinkButton href={config.profile.editRoute}>Finish</LinkButton>
        ) : (
          <Button onClick={step < steps.length - 1 ? () => setStep(step => step + 1) : onFinish}>
            {step < steps.length - 1 ? 'Next' : 'Finish'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
