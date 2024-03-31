import { Dropdown, PaginationControls, Typography } from '@/components/common';
import Feedback, { feedbackTypeNames } from '@/components/events/Feedback';
import { config } from '@/lib';
import { FeedbackAPI } from '@/lib/api';
import withAccessType from '@/lib/hoc/withAccessType';
import useQueryState from '@/lib/hooks/useQueryState';
import { CookieService, PermissionService } from '@/lib/services';
import type { PrivateProfile, PublicFeedback } from '@/lib/types/apiResponses';
import { CookieType, FeedbackStatus, FeedbackType, UserAccessType } from '@/lib/types/enums';
import { isEnum } from '@/lib/utils';
import styles from '@/styles/pages/feedback.module.scss';
import type { GetServerSideProps } from 'next';
import { useState } from 'react';

type FilterOptions = {
  type: 'any' | FeedbackType;
  status: 'any' | FeedbackStatus;
};

const DEFAULT_FILTER_STATE: FilterOptions = {
  type: 'any',
  status: 'any',
};

const ROWS_PER_PAGE = 25;

interface FeedbackPageProps {
  user: PrivateProfile;
  feedback: PublicFeedback[];
  token: string;
  initialFilters: FilterOptions;
}
const FeedbackPage = ({ user, feedback, token, initialFilters }: FeedbackPageProps) => {
  const [page, setPage] = useState(0);

  const [states, setStates] = useQueryState({
    pathName: config.feedbackRoute,
    initialFilters,
    queryStates: {
      type: {
        defaultValue: DEFAULT_FILTER_STATE.type,
        valid: type => type === 'any' || isEnum(FeedbackType, type),
      },
      status: {
        defaultValue: DEFAULT_FILTER_STATE.status,
        valid: status => status === 'any' || isEnum(FeedbackStatus, status),
      },
    },
  });

  const typeFilter = states.type?.value || DEFAULT_FILTER_STATE.type;
  const statusFilter = states.status?.value || DEFAULT_FILTER_STATE.status;

  /** Whether the user can respond to feedback */
  const isAdmin = user.accessType === UserAccessType.ADMIN;

  return (
    <div className={styles.page}>
      <Typography variant="h2/bold" component="h1">
        Feedback Submissions
      </Typography>
      <div className={styles.controls}>
        <div className={styles.filterOption}>
          <Dropdown
            name="typeOptions"
            ariaLabel="Filter feedback by type"
            options={[
              { value: 'any', label: 'Any type' },
              ...Object.entries(feedbackTypeNames).map(([value, label]) => ({ value, label })),
            ]}
            value={typeFilter}
            onChange={v => {
              setStates('type', v);
              setPage(0);
            }}
          />
        </div>

        <div className={styles.filterOption}>
          <Dropdown
            name="statusOptions"
            ariaLabel="Filter feedback by status"
            options={[
              { value: 'any', label: 'Any status' },
              { value: FeedbackStatus.SUBMITTED, label: 'Pending response' },
              { value: FeedbackStatus.ACKNOWLEDGED, label: 'Acknowledged' },
              { value: FeedbackStatus.IGNORED, label: 'Ignored' },
            ]}
            value={statusFilter}
            onChange={v => {
              setStates('status', v);
              setPage(0);
            }}
          />
        </div>
      </div>
      {feedback
        .sort((a, b) => {
          // If admin, put SUBMITTED feedback on top
          if (isAdmin && a.status !== b.status) {
            return (
              (a.status === FeedbackStatus.SUBMITTED ? 0 : 1) -
              (b.status === FeedbackStatus.SUBMITTED ? 0 : 1)
            );
          }
          // Otherwise, just put most recent first
          return +new Date(b.timestamp) - +new Date(a.timestamp);
        })
        .map(feedback => (
          <Feedback
            key={feedback.uuid}
            feedback={feedback}
            showUser={isAdmin}
            responseToken={isAdmin ? token : null}
          />
        ))}
      {feedback.length > 0 ? (
        <PaginationControls
          page={page}
          onPage={page => setPage(page)}
          pages={Math.ceil(feedback.length / ROWS_PER_PAGE)}
        />
      ) : null}
    </div>
  );
};

export default FeedbackPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const feedback = await FeedbackAPI.getFeedback(token);

  const { type, status = DEFAULT_FILTER_STATE.status } = query;

  const initialFilters: FilterOptions = {
    type:
      type === 'any' || (typeof type === 'string' && isEnum(FeedbackType, type))
        ? type
        : DEFAULT_FILTER_STATE.type,
    status:
      status === 'any' || (typeof status === 'string' && isEnum(FeedbackStatus, status))
        ? status
        : DEFAULT_FILTER_STATE.status,
  };

  return { props: { title: 'Feedback Submissions', feedback, token, initialFilters } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
