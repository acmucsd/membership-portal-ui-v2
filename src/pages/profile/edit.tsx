import { EditBlock, EditField, SingleField, Switch } from '@/components/profile';
import { majors } from '@/lib/constants/majors.json';
import withAccessType from '@/lib/hoc/withAccessType';
import { PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import styles from '@/styles/pages/profile/edit.module.scss';
import type { GetServerSideProps } from 'next';
import { useMemo, useState } from 'react';
import { BsDiscord, BsFacebook, BsGithub, BsInstagram, BsLinkedin } from 'react-icons/bs';

interface EditProfileProps {
  user: PrivateProfile;
}

const EditProfilePage = ({ user }: EditProfileProps) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.uuid);
  const [email, setEmail] = useState(user.email);
  const [major, setMajor] = useState(user.major);
  const [graduationYear, setGraduationYear] = useState(String(user.graduationYear));
  const [bio, setBio] = useState(user.bio);

  const [canSeeAttendance, setCanSeeAttendance] = useState(false);
  const [isResumeVisible, setIsResumeVisible] = useState(false);

  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const years = useMemo(() => {
    const years: number[] = [];
    const currentYear = new Date().getUTCFullYear();
    // UCSD's 6-year graduation rate is 87%. Make sure the user's graduation year
    // is listed in the dropdown (in case they're taking longer than expected to
    // graduate)
    for (
      let year = Math.min(user.graduationYear, currentYear - 2);
      year <= currentYear + 6;
      year += 1
    ) {
      years.push(year);
    }
    return years;
  }, [user.graduationYear]);

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
              <summary>
                <h2>Basic Info</h2>
              </summary>
              <div className={styles.section}>
                <EditBlock title="Profile Photo" />
                <EditBlock title="Display Name">
                  <SingleField
                    label="First"
                    placeholder="John"
                    value={firstName}
                    onChange={setFirstName}
                  />
                  <SingleField
                    label="Last"
                    placeholder="Doe"
                    value={lastName}
                    onChange={setLastName}
                  />
                </EditBlock>
              </div>
            </details>
            <details open>
              <summary>
                <h2>Account Management</h2>
              </summary>
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
                <EditBlock title="Reset Password">
                  <SingleField
                    label="Current Password"
                    type="password"
                    value={passwordCurrent}
                    onChange={setPasswordCurrent}
                  />
                  <SingleField
                    label="New Password"
                    type="password"
                    value={passwordNew}
                    onChange={setPasswordNew}
                  />
                  <SingleField
                    label="Confirm Password"
                    type="password"
                    value={passwordConfirm}
                    onChange={setPasswordConfirm}
                  />
                </EditBlock>
              </div>
            </details>
            <details open>
              <summary>
                <h2>About Me</h2>
              </summary>
              <div className={styles.section}>
                <EditField
                  label="Major"
                  element="select"
                  options={majors}
                  value={major}
                  onChange={setMajor}
                />
                <EditField
                  label="Graduation Year"
                  element="select"
                  options={years.map(String)}
                  value={graduationYear}
                  onChange={setGraduationYear}
                />
                <EditField
                  label="Biography"
                  maxLength={200}
                  element="textarea"
                  value={bio}
                  onChange={setBio}
                />
                <EditBlock title="Resume">
                  <Switch checked={isResumeVisible} onCheck={setIsResumeVisible}>
                    Share my resume with recruiters from ACM sponsor companies
                  </Switch>
                </EditBlock>
                <EditBlock title="Attendance">
                  <Switch checked={canSeeAttendance} onCheck={setCanSeeAttendance}>
                    Display my ACM attendance history on my profile
                  </Switch>
                </EditBlock>
              </div>
            </details>
            <details open>
              <summary>
                <h2>External Links</h2>
              </summary>
              <div className={styles.section}>
                <EditField
                  icon={<BsLinkedin className={styles.icon} aria-hidden />}
                  label="LinkedIn"
                  type="url"
                  placeholder="linkedin.com/in/"
                  value=""
                  onChange={() => {}}
                />
                <EditField
                  icon={<BsGithub className={styles.icon} aria-hidden />}
                  label="GitHub"
                  type="url"
                  placeholder="github.com/"
                  value=""
                  onChange={() => {}}
                />
                <EditField
                  icon={<BsDiscord className={styles.icon} aria-hidden />}
                  label="Discord"
                  type="url"
                  placeholder="discord.com/"
                  value=""
                  onChange={() => {}}
                />
                <EditField
                  icon={<BsFacebook className={styles.icon} aria-hidden />}
                  label="Facebook"
                  type="url"
                  placeholder="facebook.com/"
                  value=""
                  onChange={() => {}}
                />
                <EditField
                  icon={<BsInstagram className={styles.icon} aria-hidden />}
                  label="Instagram"
                  type="url"
                  placeholder="instagram.com/"
                  value=""
                  onChange={() => {}}
                />
              </div>
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
