import Resume from '@/components/admin/Resume';
import { Typography } from '@/components/common';
import { config } from '@/lib';
import { ResumeAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { PublicResume } from '@/lib/types/apiResponses';
import styles from '@/styles/pages/resumes.module.scss';

interface AdminResumePageProps {
  resumes: PublicResume[];
}

const AdminResumePage = ({ resumes }: AdminResumePageProps) => {
  return (
    <div className={styles.page}>
      <Typography variant="title/large" component="h1">
        Resumes
      </Typography>
      {resumes.map(resume => (
        <Resume key={resume.uuid} resume={resume} />
      ))}
    </div>
  );
};

export default AdminResumePage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth<AdminResumePageProps> = async ({
  authToken,
}) => {
  const resumes = await ResumeAPI.getResumes(authToken);
  return { props: { title: 'View Resumes', resumes } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canViewResumes,
  { redirectTo: config.homeRoute }
);
