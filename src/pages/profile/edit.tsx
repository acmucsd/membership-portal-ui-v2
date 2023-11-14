import { EditBlock, EditField, SingleField, Switch } from '@/components/profile';
import { ResumeAPI } from '@/lib/api';
import majors from '@/lib/constants/majors.json';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import styles from '@/styles/pages/profile/edit.module.scss';
import { AxiosError } from 'axios';
import type { GetServerSideProps } from 'next';
import { useMemo, useState } from 'react';
import { BsDiscord, BsFacebook, BsGithub, BsInstagram, BsLinkedin } from 'react-icons/bs';

/**
 * Forces the server to re-generate the user cookie. The server does this in
 * `withAccessType.ts:58`.
 */
function regenerateUser() {
  CookieService.setClientCookie(CookieType.USER, '');
}

interface EditProfileProps {
  user: PrivateProfile;
  authToken: string;
}

const EditProfilePage = ({ user, authToken }: EditProfileProps) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.uuid);
  const [email, setEmail] = useState(user.email);
  const [major, setMajor] = useState(user.major);
  const [graduationYear, setGraduationYear] = useState(String(user.graduationYear));
  const [bio, setBio] = useState(user.bio);

  const [canSeeAttendance, setCanSeeAttendance] = useState(false); // TEMP
  const [isResumeVisible, setIsResumeVisible] = useState(
    user.resumes?.some(resume => resume.isResumeVisible) || user.resumes?.length === 0
  );

  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [resumes, setResumes] = useState(user.resumes ?? []);

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
                  options={majors.majors}
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
                  {resumes.map(resume => {
                    const fileName = decodeURI(
                      new URL(resume.url).pathname.split('/').slice(4).join('/')
                    );
                    return (
                      <div key={resume.uuid}>
                        <a href={resume.url} download={fileName}>
                          {fileName}
                        </a>
                        <button
                          type="button"
                          onClick={async () => {
                            await ResumeAPI.deleteResume(authToken, resume.uuid);
                            setResumes(resumes.filter(({ uuid }) => uuid !== resume.uuid));
                            regenerateUser();
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                  <label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={async e => {
                        const file = e.currentTarget.files?.[0];
                        try {
                          if (file) {
                            const resume = await ResumeAPI.uploadResume(
                              authToken,
                              file,
                              isResumeVisible
                            );
                            // NOTE: The server currently overwrites the
                            // previous resume with the new one.
                            // https://github.com/acmucsd/membership-portal/blob/a45a68833854068aa3a6cceee59700f84114c308/api/controllers/ResumeController.ts#L45-L46
                            setResumes([resume]);
                            regenerateUser();
                          }
                        } catch (error: unknown) {
                          if (error instanceof AxiosError) {
                            const message = error.response?.data?.error?.message;
                            // TODO
                            console.error(message);
                          }
                        }
                      }}
                    />
                    Upload New
                  </label>
                  <Switch checked={isResumeVisible} onCheck={setIsResumeVisible}>
                    Share my resume with recruiters from ACM sponsor companies
                  </Switch>
                  <p>
                    By uploading your resume and opting in to sharing, you grant ACM permission to
                    send your resume to recruiters at our sponsor companies.
                  </p>
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

const getServerSidePropsFunc: GetServerSideProps = async ({ req, res }) => {
  const AUTH_TOKEN = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });

  return { props: { authToken: AUTH_TOKEN } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.allUserTypes()
);
