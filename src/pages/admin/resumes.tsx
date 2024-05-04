import Resume from '@/components/admin/Resume';
import { PaginationControls, Typography } from '@/components/common';
import { config } from '@/lib';
import { ResumeAPI } from '@/lib/api';
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import type { PublicResume } from '@/lib/types/apiResponses';
import { getFileName, useObjectUrl } from '@/lib/utils';
import styles from '@/styles/pages/resumes.module.scss';
import JSZip from 'jszip';
import { useEffect, useRef, useState } from 'react';
import { BsDownload } from 'react-icons/bs';

const ROWS_PER_PAGE = 25;

type DownloadState =
  | { stage: 'idle' }
  | { stage: 'downloading'; loaded: number }
  | { stage: 'ready'; blob: Blob };

interface AdminResumePageProps {
  resumes: PublicResume[];
}

const AdminResumePage = ({ resumes }: AdminResumePageProps) => {
  const [page, setPage] = useState(0);
  const [downloadState, setDownloadState] = useState<DownloadState>({ stage: 'idle' });
  const zipUrl = useObjectUrl(downloadState.stage === 'ready' ? downloadState.blob : null);
  const downloadButton = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (zipUrl !== '') {
      downloadButton.current?.click();
    }
  }, [zipUrl]);

  return (
    <div className={styles.page}>
      <Typography variant="title/large" component="h1" className={styles.header}>
        Resumes
        {downloadState.stage === 'idle' ? (
          <button
            type="button"
            className={styles.button}
            onClick={async () => {
              const zip = new JSZip();
              let loaded = 0;
              setDownloadState({ stage: 'downloading', loaded });
              await Promise.all(
                resumes.map(resume =>
                  fetch(resume.url)
                    .then(r => r.blob())
                    .then(blob => {
                      loaded += 1;
                      setDownloadState({ stage: 'downloading', loaded });
                      zip.file(getFileName(resume.url, `${resume.uuid}.pdf`), blob);
                    })
                )
              );
              setDownloadState({ stage: 'ready', blob: await zip.generateAsync({ type: 'blob' }) });
            }}
          >
            <BsDownload /> Download All
          </button>
        ) : null}
        {downloadState.stage === 'downloading' ? (
          <span className={styles.downloading}>
            Downloading {resumes.length - downloadState.loaded} of {resumes.length}...
          </span>
        ) : null}
        {downloadState.stage === 'ready' ? (
          <a href={zipUrl} className={styles.button} ref={downloadButton} download="resumes.zip">
            <BsDownload /> Download All
          </a>
        ) : null}
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
