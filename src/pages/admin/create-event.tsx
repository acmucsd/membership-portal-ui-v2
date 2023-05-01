import { config, showToast } from '@/lib';
import withAccessType from '@/lib/hoc/withAccessType';
import { AdminEventManager } from '@/lib/managers';
import { PermissionService } from '@/lib/services';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';

const AdminPage: NextPage = () => {
  const [query, setQuery] = useState('');
  const [eventData, setEventData] = useState({});

  const handleClick = () =>
    AdminEventManager.getEventFromNotionURL({
      pageUrl: query,
      onSuccessCallback: data => {
        setEventData(data);
      },
      onFailCallback: err => {
        showToast('Notion API Error', err);
      },
    });
  return (
    <div>
      <Link href="/admin">Back</Link>
      <h2>Autofill Event From Notion</h2>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Notion Calendar Page URL"
      />
      <p>
        A valid page links looks like&nbsp;
        <b>https://www.notion.so/acmucsd/ACMovie-Night-faf51c942e514f7abdcdd4413032504c</b>
      </p>
      <button type="button" onClick={handleClick}>
        Autofill
      </button>
      <pre>{JSON.stringify(eventData, null, 2)}</pre>
    </div>
  );
};

export default AdminPage;

const getServerSidePropsFunc: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.canCreateEvent(),
  config.homeRoute
);
