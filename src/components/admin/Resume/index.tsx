import { GifSafeImage, Typography } from '@/components/common';
import { config } from '@/lib';
import { PublicResume } from '@/lib/types/apiResponses';
import { getProfilePicture } from '@/lib/utils';
import Link from 'next/link';
import { BsDownload } from 'react-icons/bs';
import styles from './style.module.scss';

interface ResumeProps {
  resume: PublicResume;
}

const Resume = ({ resume }: ResumeProps) => {
  const fileName = decodeURIComponent(resume.url.split('/').at(-1) ?? 'resume.pdf');

  return (
    <div className={styles.wrapper}>
      {resume.user ? (
        <Link href={`${config.userProfileRoute}${resume.user.handle}`} className={styles.user}>
          <GifSafeImage
            src={getProfilePicture(resume.user)}
            width={48}
            height={48}
            alt={`Profile picture for ${resume.user.firstName} ${resume.user.lastName}`}
            className={styles.image}
          />
          <Typography variant="label/large" className={styles.name}>
            {resume.user.firstName} {resume.user.lastName}
          </Typography>
          <p className={styles.info}>
            {resume.user.graduationYear} {resume.user.major}
          </p>
        </Link>
      ) : null}
      <Link href={resume.url} className={styles.resume}>
        <BsDownload className={styles.image} />
        <p className={styles.name}>{fileName}</p>
        <p className={styles.info}>
          Uploaded {new Date(resume.lastUpdated).toLocaleDateString('en-US', { dateStyle: 'full' })}
        </p>
      </Link>
    </div>
  );
};

export default Resume;
