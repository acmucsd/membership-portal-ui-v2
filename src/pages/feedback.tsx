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
import Link from 'next/link';
import { useMemo, useState } from 'react';

type FilterOptions = {
  type: 'any' | FeedbackType;
  status: 'any' | FeedbackStatus;
  sort: 'chronological' | 'submitted-first';
};

const DEFAULT_FILTER_STATE: FilterOptions = {
  type: 'any',
  status: 'any',
  sort: 'chronological',
};

const ROWS_PER_PAGE = 25;

interface FeedbackPageProps {
  user: PrivateProfile;
  feedback: PublicFeedback[];
  token: string;
  initialFilters: FilterOptions;
}
const FeedbackPage = ({ user, feedback, token, initialFilters }: FeedbackPageProps) => {
  /** Whether the user can respond to feedback */
  const isAdmin = user.accessType === UserAccessType.ADMIN;
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
      sort: {
        defaultValue: DEFAULT_FILTER_STATE.sort,
        valid: sort => sort === 'chronological' || sort === 'submitted-first',
      },
    },
  });

  const typeFilter = states.type?.value || DEFAULT_FILTER_STATE.type;
  const statusFilter = states.status?.value || DEFAULT_FILTER_STATE.status;
  const sortFilter = states.sort?.value || DEFAULT_FILTER_STATE.sort;

  const filteredFeedback = useMemo(
    () =>
      feedback
        .filter(
          feedback =>
            (typeFilter === 'any' || feedback.type === typeFilter) &&
            (statusFilter === 'any' || feedback.status === statusFilter)
        )
        .sort((a, b) => {
          // Put SUBMITTED feedback on top
          if (sortFilter === 'submitted-first' && a.status !== b.status) {
            return (
              (a.status === FeedbackStatus.SUBMITTED ? 0 : 1) -
              (b.status === FeedbackStatus.SUBMITTED ? 0 : 1)
            );
          }
          // Otherwise, just put most recent first
          return +new Date(b.timestamp) - +new Date(a.timestamp);
        }),
    [feedback, typeFilter, statusFilter, sortFilter]
  );

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

        {isAdmin ? (
          <div className={styles.filterOption}>
            <Dropdown
              name="sortOptions"
              ariaLabel="Sort feedback"
              options={[
                { value: 'chronological', label: 'Most recent first' },
                { value: 'submitted-first', label: 'Pending response first' },
              ]}
              value={sortFilter}
              onChange={v => {
                setStates('sort', v);
                setPage(0);
              }}
            />
          </div>
        ) : null}
      </div>
      {filteredFeedback.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE).map(feedback => (
        <Feedback
          key={feedback.uuid}
          feedback={feedback}
          showUser={isAdmin}
          responseToken={isAdmin ? token : null}
        />
      ))}
      {filteredFeedback.length > 0 ? (
        <PaginationControls
          page={page}
          onPage={page => setPage(page)}
          pages={Math.ceil(filteredFeedback.length / ROWS_PER_PAGE)}
        />
      ) : (
        <Typography variant="body/medium">
          {typeFilter !== 'any' || statusFilter !== 'any' ? (
            'No feedback matches these criteria.'
          ) : (
            <>
              You haven&lsquo;t submitted any feedback yet!{' '}
              <Link href={`${config.eventsRoute}?attendance=attended`} className={styles.link}>
                Review your recent events.
              </Link>
            </>
          )}
        </Typography>
      )}
    </div>
  );
};

export default FeedbackPage;

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res, query }) => {
  const token = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  const feedback = await FeedbackAPI.getFeedback(token);

  const { type, status, sort } = query;

  const initialFilters: FilterOptions = {
    type:
      type === 'any' || (typeof type === 'string' && isEnum(FeedbackType, type))
        ? type
        : DEFAULT_FILTER_STATE.type,
    status:
      status === 'any' || (typeof status === 'string' && isEnum(FeedbackStatus, status))
        ? status
        : DEFAULT_FILTER_STATE.status,
    sort: sort === 'chronological' || sort === 'submitted-first' ? sort : DEFAULT_FILTER_STATE.sort,
  };

  return { props: { title: 'Feedback Submissions', feedback, token, initialFilters } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
