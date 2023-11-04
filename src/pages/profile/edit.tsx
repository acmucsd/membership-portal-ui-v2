import { EditField } from '@/components/profile';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import styles from '@/styles/pages/profile/edit.module.scss';
import type { GetServerSideProps } from 'next';
import { useState } from 'react';

interface EditProfileProps {
  user: PrivateProfile;
}

const EditProfilePage = ({ user }: EditProfileProps) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.uuid);
  const [email, setEmail] = useState(user.email);

  return (
    <>
      <h1 className={styles.title}>Edit Profile</h1>
      <div className={styles.mainContent}>
        <div className={styles.columns}>
          <section className={styles.columnLeft}>
            <h2>Current Profile</h2>
          </section>
          <section className={styles.columnRight}>
            <details open>
              <summary>Basic Info</summary>
            </details>
            <details open>
              <summary>Account Management</summary>
              <div className={styles.section}>
                <EditField
                  label="Username"
                  placeholder="supreme-coder"
                  description="This will be your unique URL on the Membership Portal."
                  prefix="members.acmucsd.com/u/"
                  maxLength={30}
                  value={username}
                  onChange={setUsername}
                />
                <EditField
                  label="Email Address"
                  placeholder="jdoe@ucsd.edu"
                  description="Enter an email for login to your account."
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
              </div>
            </details>
            <details open>
              <summary>About Me</summary>
            </details>
            <details open>
              <summary>External Links</summary>
            </details>
          </section>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;

const getServerSidePropsFunc: GetServerSideProps = async () => ({
  props: {},
});

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
