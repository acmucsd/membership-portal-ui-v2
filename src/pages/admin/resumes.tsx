import Resume from '@/components/admin/Resume';
import { PaginationControls, Typography } from '@/components/common';
import { config } from '@/lib';
import { ResumeAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { PublicResume } from '@/lib/types/apiResponses';
import styles from '@/styles/pages/resumes.module.scss';
import { useState } from 'react';

const ROWS_PER_PAGE = 25;

interface AdminResumePageProps {
  resumes: PublicResume[];
}

const AdminResumePage = ({ resumes }: AdminResumePageProps) => {
  const [page, setPage] = useState(0);

  return (
    <div className={styles.page}>
      <Typography variant="title/large" component="h1">
        Resumes
      </Typography>
      {resumes.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE).map(resume => (
        <Resume key={resume.uuid} resume={resume} />
      ))}
      <PaginationControls
        page={page}
        onPage={page => setPage(page)}
        pages={Math.ceil(resumes.length / ROWS_PER_PAGE)}
      />
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
