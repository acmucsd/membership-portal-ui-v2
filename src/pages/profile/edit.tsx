import { Cropper } from '@/components/common';
import { EditBlock, EditField, Preview, SingleField, Switch } from '@/components/profile';
import { config, showToast } from '@/lib';
import { AuthAPI, ResumeAPI, UserAPI } from '@/lib/api';
import majors from '@/lib/constants/majors.json';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getMessagesFromError, getProfilePicture, isSrcAGif } from '@/lib/utils';
import DownloadIcon from '@/public/assets/icons/download-icon.svg';
import DropdownIcon from '@/public/assets/icons/dropdown-arrow-1.svg';
import styles from '@/styles/pages/profile/edit.module.scss';
import { AxiosError } from 'axios';
import type { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { BsDiscord, BsFacebook, BsGithub, BsInstagram, BsLinkedin } from 'react-icons/bs';

/**
 * Forces the server to re-generate the user cookie. The server does this in
 * `withAccessType.ts:58`.
 */
function regenerateUser() {
  CookieService.setClientCookie(CookieType.USER, '');
}

function reportError(title: string, error: unknown) {
  if (error instanceof AxiosError && error.response?.data?.error) {
    showToast(title, getMessagesFromError(error.response.data.error).join('\n\n'));
  } else if (error instanceof Error) {
    showToast(title, error.message);
  } else {
    showToast(title, 'Unknown error');
  }
}

interface EditProfileProps {
  user: PrivateProfile;
  authToken: string;
}

const EditProfilePage = ({ user: initUser, authToken }: EditProfileProps) => {
  const [user, setUser] = useState(initUser);

  const pfpUploadId = useId();
  const [pfp, setPfp] = useState<File | null>(null);
  // A value to force the browser to fetch the new profile photo
  const [pfpCacheBust, setPfpCacheBust] = useState(-1);
  const [pfpDrop, setPfpDrop] = useState(false);

  const [firstName, setFirstName] = useState(initUser.firstName);
  const [lastName, setLastName] = useState(initUser.lastName);
  const [handle, setHandle] = useState(initUser.handle);
  const [email, setEmail] = useState(initUser.email);
  const [major, setMajor] = useState(initUser.major);
  const [graduationYear, setGraduationYear] = useState(String(initUser.graduationYear));
  const [bio, setBio] = useState(initUser.bio);

  const [canSeeAttendance, setCanSeeAttendance] = useState(false); // TEMP
  const [isResumeVisible, setIsResumeVisible] = useState(
    initUser.resumes?.some(resume => resume.isResumeVisible) || initUser.resumes?.length === 0
  );

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const hasChange =
    firstName !== user.firstName ||
    lastName !== user.lastName ||
    handle !== user.handle ||
    email !== user.email ||
    major !== user.major ||
    +graduationYear !== user.graduationYear ||
    bio !== user.bio ||
    newPassword.length > 0;

  const [resumes, setResumes] = useState(initUser.resumes ?? []);

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
            <Preview user={user} pfpCacheBust={pfpCacheBust} />
          </section>
          <form
            className={styles.columnRight}
            onSubmit={async e => {
              e.preventDefault();

              let changed = false;
              if (
                firstName !== user.firstName ||
                lastName !== user.lastName ||
                handle !== user.handle ||
                email !== user.email ||
                major !== user.major ||
                +graduationYear !== user.graduationYear ||
                bio !== user.bio ||
                newPassword.length > 0
              ) {
                try {
                  setUser(
                    await UserAPI.updateCurrentUser(authToken, {
                      firstName: firstName !== user.firstName ? firstName : undefined,
                      lastName: lastName !== user.lastName ? lastName : undefined,
                      handle: handle !== user.handle ? handle : undefined,
                      major: major !== user.major ? major : undefined,
                      graduationYear:
                        +graduationYear !== user.graduationYear ? +graduationYear : undefined,
                      bio: bio !== user.bio ? bio : undefined,
                      passwordChange:
                        newPassword.length > 0
                          ? { password, newPassword, confirmPassword }
                          : undefined,
                    })
                  );
                  changed = true;
                } catch (error) {
                  reportError('Changes failed to save', error);
                }
              }
              if (email !== user.email) {
                try {
                  await AuthAPI.modifyEmail(authToken, email);
                  setUser(user => ({ ...user, email }));
                  changed = true;
                } catch (error) {
                  reportError('Email failed to change', error);
                }
              }
              if (changed) {
                regenerateUser();
                showToast('Changes saved!');
              }
            }}
          >
            <details open>
              <summary>
                <h2>Basic Info</h2>
                <DropdownIcon />
              </summary>
              <div className={styles.section}>
                <EditBlock title="Profile Photo">
                  <div
                    className={`${styles.pfpWrapper} ${pfpDrop ? styles.dropOver : ''}`}
                    onDrop={e => {
                      if (e.dataTransfer.types.includes('Files') && e.dataTransfer.files[0]) {
                        setPfp(e.dataTransfer.files[0]);
                      }
                      setPfpDrop(false);
                      e.preventDefault();
                    }}
                    onDragOver={e => {
                      setPfpDrop(true);
                      e.preventDefault();
                    }}
                    onDragLeave={() => setPfpDrop(false)}
                  >
                    <label className={styles.pfpOutline} htmlFor={pfpUploadId}>
                      <Image
                        className={styles.pfp}
                        src={
                          getProfilePicture(user) +
                          (pfpCacheBust !== -1 ? `?_=${pfpCacheBust}` : '')
                        }
                        alt="Profile picture"
                        width={125}
                        height={125}
                        unoptimized={isSrcAGif(user.profilePicture)}
                      />
                    </label>
                    <div className={styles.pfpButtons}>
                      <label className={`${styles.button} ${styles.primaryBtn} ${styles.smaller}`}>
                        <input
                          id={pfpUploadId}
                          className={styles.fileInput}
                          type="file"
                          accept="image/*"
                          onChange={async e => {
                            const file = e.currentTarget.files?.[0];
                            e.currentTarget.value = '';
                            if (file) {
                              setPfp(file);
                            }
                          }}
                        />
                        Upload New
                      </label>
                      <button
                        className={`${styles.button} ${styles.dangerBtn} ${styles.smaller}`}
                        type="button"
                        disabled
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </EditBlock>
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
                <DropdownIcon />
              </summary>
              <div className={styles.section}>
                <EditField
                  label="Username"
                  placeholder="supreme-coder"
                  description="This will be your unique URL on the Membership Portal."
                  prefix="members.acmucsd.com/u/"
                  maxLength={30}
                  value={handle}
                  onChange={setHandle}
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
                    value={password}
                    onChange={setPassword}
                  />
                  <SingleField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={setNewPassword}
                  />
                  <SingleField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                  />
                </EditBlock>
              </div>
            </details>
            <details open>
              <summary>
                <h2>About Me</h2>
                <DropdownIcon />
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
                      <div className={styles.resume} key={resume.uuid}>
                        <a
                          className={`${styles.button} ${styles.borderBtn} ${styles.smaller} ${styles.medium}`}
                          href={resume.url}
                          download={fileName}
                        >
                          <DownloadIcon className={styles.downloadIcon} />
                          <span>{fileName}</span>
                        </a>
                        <button
                          className={`${styles.button} ${styles.dangerBtn} ${styles.smaller}`}
                          type="button"
                          onClick={async () => {
                            try {
                              await ResumeAPI.deleteResume(authToken, resume.uuid);
                              setResumes(resumes.filter(({ uuid }) => uuid !== resume.uuid));
                              regenerateUser();
                              showToast('Successfully deleted resume!');
                            } catch (error) {
                              reportError('Failed to delete resume', error);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                  <div className={styles.resume}>
                    <label className={`${styles.button} ${styles.primaryBtn} ${styles.smaller}`}>
                      <input
                        className={styles.fileInput}
                        type="file"
                        accept=".pdf"
                        onChange={async e => {
                          const file = e.currentTarget.files?.[0];
                          e.currentTarget.value = '';
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
                              showToast('Resume uploaded!');
                            }
                          } catch (error) {
                            reportError('Resume failed to upload', error);
                          }
                        }}
                      />
                      Upload New
                    </label>
                  </div>
                  <Switch checked={isResumeVisible} onCheck={setIsResumeVisible}>
                    Share my resume with recruiters from ACM sponsor companies
                  </Switch>
                  <p>
                    By uploading your resume and opting in to sharing, you grant ACM permission to
                    send your resume to recruiters at our sponsor companies.
                  </p>
                </EditBlock>
                <EditBlock title="Attendance">
                  <Switch checked={canSeeAttendance} onCheck={setCanSeeAttendance} disabled>
                    Display my ACM attendance history on my profile
                  </Switch>
                </EditBlock>
              </div>
            </details>
            <details open>
              <summary>
                <h2>External Links</h2>
                <DropdownIcon />
              </summary>
              <div className={styles.section}>
                <EditField
                  icon={<BsLinkedin className={styles.icon} aria-hidden />}
                  label="LinkedIn"
                  type="url"
                  placeholder="linkedin.com/in/"
                  value=""
                  onChange={() => {}}
                  disabled
                />
                <EditField
                  icon={<BsGithub className={styles.icon} aria-hidden />}
                  label="GitHub"
                  type="url"
                  placeholder="github.com/"
                  value=""
                  onChange={() => {}}
                  disabled
                />
                <EditField
                  icon={<BsDiscord className={styles.icon} aria-hidden />}
                  label="Discord"
                  type="url"
                  placeholder="discord.com/"
                  value=""
                  onChange={() => {}}
                  disabled
                />
                <EditField
                  icon={<BsFacebook className={styles.icon} aria-hidden />}
                  label="Facebook"
                  type="url"
                  placeholder="facebook.com/"
                  value=""
                  onChange={() => {}}
                  disabled
                />
                <EditField
                  icon={<BsInstagram className={styles.icon} aria-hidden />}
                  label="Instagram"
                  type="url"
                  placeholder="instagram.com/"
                  value=""
                  onChange={() => {}}
                  disabled
                />
              </div>
            </details>
            <div className={styles.submitBtns}>
              <Link className={`${styles.button} ${styles.cancelBtn}`} href={config.profile.route}>
                Cancel
              </Link>
              <button
                type="submit"
                className={`${styles.button} ${styles.primaryBtn}`}
                disabled={!hasChange}
              >
                Save
              </button>
            </div>
          </form>
          <Cropper
            file={pfp}
            aspectRatio={1}
            circle
            maxFileHeight={256}
            onUpload={async file => {
              try {
                setUser(await UserAPI.uploadProfilePicture(authToken, file));
                setPfpCacheBust(Date.now());
                regenerateUser();
                showToast('Profile photo uploaded!');
                setPfp(null);
              } catch (error) {
                reportError('Photo failed to upload', error);
              }
            }}
            onClose={reason => {
              setPfp(null);
              if (reason !== null) {
                showToast('This image format is not supported.');
              }
            }}
          />
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
