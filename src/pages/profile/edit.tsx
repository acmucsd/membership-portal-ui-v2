import { Cropper, GifSafeImage } from '@/components/common';
import {
  EditBlock,
  EditField,
  Preview,
  SingleField,
  SocialMediaIcon,
  Switch,
} from '@/components/profile';
import { config, showToast } from '@/lib';
import { AuthAPI, ResumeAPI, UserAPI } from '@/lib/api';
import majors from '@/lib/constants/majors';
import socialMediaTypes from '@/lib/constants/socialMediaTypes';
import withAccessType from '@/lib/hoc/withAccessType';
import { CookieService, PermissionService } from '@/lib/services';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType, SocialMediaType } from '@/lib/types/enums';
import { capitalize, getMessagesFromError, getProfilePicture } from '@/lib/utils';
import DownloadIcon from '@/public/assets/icons/download-icon.svg';
import DropdownIcon from '@/public/assets/icons/dropdown-arrow-1.svg';
import styles from '@/styles/pages/profile/edit.module.scss';
import { AxiosError } from 'axios';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { FormEvent, useEffect, useId, useMemo, useState } from 'react';

function reportError(title: string, error: unknown) {
  if (error instanceof AxiosError && error.response?.data?.error) {
    showToast(title, getMessagesFromError(error.response.data.error).join('\n\n'));
  } else if (error instanceof Error) {
    showToast(title, error.message);
  } else {
    showToast(title, 'Unknown error');
  }
}

function fixUrl(input: string, prefix?: string): string {
  // Return input as-is if it's blank or includes a protocol
  if (!input || input.includes('://')) {
    return input;
  }
  // Encourage https://
  if (prefix && input.startsWith('http://')) {
    return input.replace('http', 'https');
  }
  // If the user typed in their username
  if (prefix && /^[\w.-]+(?<!\.com)\/?$/.test(input)) {
    return `https://${prefix}/${input}`;
  }
  // Add https:// if it was left out
  return `https://${input}`;
}

interface EditProfileProps {
  user: PrivateProfile;
  authToken: string;
}

const EditProfilePage = ({ user: initUser, authToken }: EditProfileProps) => {
  const [user, setUser] = useState(initUser);

  useEffect(() => {
    if (user !== initUser) {
      CookieService.setClientCookie(CookieType.USER, JSON.stringify(user));
    }
  }, [user, initUser]);

  const pfpUploadId = useId();
  const [pfp, setPfp] = useState<File | null>(null);
  // A value to force the browser to fetch the new profile photo
  const [pfpCacheBust, setPfpCacheBust] = useState(-1);
  const [pfpDrop, setPfpDrop] = useState(false);

  const [firstName, setFirstName] = useState(initUser.firstName);
  const [lastName, setLastName] = useState(initUser.lastName);
  const [handle, setHandle] = useState(initUser.handle ?? '');
  const [email, setEmail] = useState(initUser.email);
  const [major, setMajor] = useState(initUser.major);
  const [graduationYear, setGraduationYear] = useState(String(initUser.graduationYear));
  const [bio, setBio] = useState(initUser.bio ?? '');

  const [isAttendancePublic, setIsAttendancePublic] = useState(initUser.isAttendancePublic);
  const [isResumeVisible, setIsResumeVisible] = useState(
    initUser.resumes?.some(resume => resume.isResumeVisible) || initUser.resumes?.length === 0
  );

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [socialMedia, setSocialMedia] = useState(
    () => new Map(initUser.userSocialMedia?.map(social => [social.type, social.url]) ?? [])
  );

  const firstNameChanged = firstName !== user.firstName;
  const lastNameChanged = lastName !== user.lastName;
  const handleChanged = handle !== (user.handle ?? '');
  const emailChanged = email !== user.email;
  const majorChanged = major !== user.major;
  const graduationYearChanged = +graduationYear !== user.graduationYear;
  const bioChanged = bio !== (user.bio ?? '');
  const isAttendancePublicChanged = isAttendancePublic !== user.isAttendancePublic;
  const passwordChanged = newPassword.length > 0;
  const profileChanged =
    firstNameChanged ||
    lastNameChanged ||
    handleChanged ||
    majorChanged ||
    graduationYearChanged ||
    bioChanged ||
    isAttendancePublicChanged ||
    passwordChanged;
  const hasChange =
    profileChanged ||
    emailChanged ||
    Array.from(socialMedia).some(
      ([type, url]) =>
        (user.userSocialMedia?.find(social => social.type === type)?.url ?? '') !== url
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let changed = false;
    if (profileChanged) {
      try {
        const newUser = await UserAPI.updateCurrentUserProfile(authToken, {
          firstName: firstNameChanged ? firstName : undefined,
          lastName: lastNameChanged ? lastName : undefined,
          handle: handleChanged ? handle : undefined,
          major: majorChanged ? major : undefined,
          graduationYear: graduationYearChanged ? +graduationYear : undefined,
          bio: bioChanged ? bio : undefined,
          isAttendancePublic: isAttendancePublicChanged ? isAttendancePublic : undefined,
          passwordChange:
            newPassword.length > 0 ? { password, newPassword, confirmPassword } : undefined,
        });
        // Doesn't include the `resumes` field, so we need to preserve
        // it
        setUser(user => ({ ...user, ...newUser }));
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
    await Promise.all(
      Array.from(socialMedia, async ([type, url]) => {
        const social = user.userSocialMedia?.find(social => social.type === type);
        if (social?.url !== url) {
          if (social) {
            if (url) {
              try {
                const newSocial = await UserAPI.updateSocialMedia(authToken, social.uuid, { url });
                setUser(user => ({
                  ...user,
                  userSocialMedia: user.userSocialMedia?.map(social =>
                    social.type === type ? newSocial : social
                  ) ?? [newSocial],
                }));
                changed = true;
              } catch (error) {
                reportError(`Failed to update ${capitalize(type)} URL`, error);
              }
            } else {
              try {
                await UserAPI.deleteSocialMedia(authToken, social.uuid);
                setUser(user => ({
                  ...user,
                  userSocialMedia: user.userSocialMedia?.filter(social => social.type !== type),
                }));
                changed = true;
              } catch (error) {
                reportError(`Failed to remove ${capitalize(type)} URL`, error);
              }
            }
          } else if (url) {
            try {
              const newSocial = await UserAPI.insertSocialMedia(authToken, {
                type,
                url,
              });
              setUser(user => ({
                ...user,
                userSocialMedia: [...(user.userSocialMedia ?? []), newSocial],
              }));
              changed = true;
            } catch (error) {
              reportError(`Failed to add ${capitalize(type)} URL`, error);
            }
          }
        }
      })
    );
    if (changed) {
      showToast('Changes saved!');
    }
  };

  // Warn if there are unsaved changes
  useEffect(() => {
    if (hasChange) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = true;
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
    return undefined;
  }, [hasChange]);

  const [resumes, setResumes] = useState(initUser.resumes ?? []);

  const years = useMemo(() => {
    const years: number[] = [];
    const currentYear = new Date().getUTCFullYear();
    // Ensure the user's graduation year is listed in the dropdown in case
    // they're taking longer than expected to graduate
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
      <div className={styles.title}>
        <h1>Edit Profile</h1>
        <Link
          href={config.logoutRoute}
          className={`${styles.button} ${styles.dangerBtn} ${styles.smaller}`}
        >
          Log out
        </Link>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.columns}>
          <section className={styles.columnLeft}>
            <h2>Current Profile</h2>
            <Preview user={user} pfpCacheBust={pfpCacheBust} />
          </section>
          <form className={styles.columnRight} onSubmit={handleSubmit}>
            <details open>
              <summary>
                <h2>Basic Info</h2>
                <DropdownIcon aria-hidden />
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
                      <GifSafeImage
                        className={styles.pfp}
                        src={
                          getProfilePicture(user) +
                          (pfpCacheBust !== -1 ? `?_=${pfpCacheBust}` : '')
                        }
                        alt="Profile picture"
                        width={125}
                        height={125}
                      />
                    </label>
                    <div className={styles.pfpButtons}>
                      <label className={`${styles.button} ${styles.primaryBtn} ${styles.smaller}`}>
                        <input
                          id={pfpUploadId}
                          className={styles.fileInput}
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.currentTarget.files?.[0];
                            e.currentTarget.value = '';
                            if (file) {
                              setPfp(file);
                            }
                          }}
                        />
                        Upload New
                      </label>
                    </div>
                  </div>
                </EditBlock>
                <EditBlock title="Display Name">
                  <SingleField
                    label="First"
                    placeholder="John"
                    changed={firstNameChanged}
                    value={firstName}
                    onChange={setFirstName}
                  />
                  <SingleField
                    label="Last"
                    placeholder="Doe"
                    changed={lastNameChanged}
                    value={lastName}
                    onChange={setLastName}
                  />
                </EditBlock>
              </div>
            </details>
            <details open>
              <summary>
                <h2>Account Management</h2>
                <DropdownIcon aria-hidden />
              </summary>
              <div className={styles.section}>
                <EditField
                  label="Username"
                  placeholder="supreme-coder"
                  description="This will be your unique URL on the Membership Portal."
                  prefix="members.acmucsd.com/u/"
                  maxLength={30}
                  changed={handleChanged}
                  value={handle}
                  onChange={setHandle}
                />
                <EditField
                  label="Email Address"
                  placeholder="jdoe@ucsd.edu"
                  description="Enter an email for login to your account."
                  type="email"
                  changed={emailChanged}
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
                    changed={passwordChanged}
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
            <details open id="about">
              <summary>
                <h2>About Me</h2>
                <DropdownIcon aria-hidden />
              </summary>
              <div className={styles.section}>
                <EditField
                  label="Major"
                  element="select"
                  options={majors}
                  changed={majorChanged}
                  value={major}
                  onChange={setMajor}
                />
                <EditField
                  label="Graduation Year"
                  element="select"
                  options={years.map(String)}
                  changed={graduationYearChanged}
                  value={graduationYear}
                  onChange={setGraduationYear}
                />
                <EditField
                  label="Biography"
                  maxLength={200}
                  element="textarea"
                  changed={bioChanged}
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
                  <Switch
                    checked={isResumeVisible}
                    onCheck={checked => {
                      resumes.forEach(async resume => {
                        try {
                          const { isResumeVisible } = await ResumeAPI.uploadResumeVisibility(
                            authToken,
                            resume.uuid,
                            checked
                          );
                          setIsResumeVisible(isResumeVisible);
                          showToast('Resume visibility preference saved!');
                        } catch (error) {
                          reportError('Failed to update resume visibility', error);
                        }
                      });
                    }}
                  >
                    Share my resume with recruiters from ACM sponsor companies
                  </Switch>
                  <p>
                    By uploading your resume and opting in to sharing, you grant ACM permission to
                    send your resume to recruiters at our sponsor companies.
                  </p>
                </EditBlock>
                <EditBlock title="Attendance">
                  <Switch checked={isAttendancePublic} onCheck={setIsAttendancePublic}>
                    Display my ACM attendance history on my profile
                    {isAttendancePublicChanged && (
                      <span className={styles.unsavedChange}> (unsaved change)</span>
                    )}
                  </Switch>
                </EditBlock>
              </div>
            </details>
            <details open>
              <summary>
                <h2>External Links</h2>
                <DropdownIcon aria-hidden />
              </summary>
              <div className={styles.section}>
                {[
                  SocialMediaType.LINKEDIN,
                  SocialMediaType.GITHUB,
                  SocialMediaType.DEVPOST,
                  SocialMediaType.PORTFOLIO,
                  SocialMediaType.FACEBOOK,
                  SocialMediaType.TWITTER,
                  SocialMediaType.INSTAGRAM,
                  SocialMediaType.EMAIL,
                ].map(socialType => (
                  <EditField
                    key={socialType}
                    icon={<SocialMediaIcon type={socialType} hidden />}
                    label={socialMediaTypes[socialType].label}
                    type={socialType === SocialMediaType.EMAIL ? 'email' : 'url'}
                    name={socialType.toLowerCase()}
                    placeholder={socialMediaTypes[socialType].domain}
                    changed={
                      (user.userSocialMedia?.find(social => social.type === socialType)?.url ??
                        '') !== (socialMedia.get(socialType) ?? '')
                    }
                    value={socialMedia.get(socialType) ?? ''}
                    onChange={url =>
                      setSocialMedia(new Map([...Array.from(socialMedia), [socialType, url]]))
                    }
                    onBlur={
                      socialType !== SocialMediaType.EMAIL
                        ? url => fixUrl(url, socialMediaTypes[socialType].domain)
                        : undefined
                    }
                  />
                ))}
              </div>
            </details>
            <div className={`${styles.submitBtns} ${hasChange ? styles.unsavedChanges : ''}`}>
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
            onCrop={async file => {
              try {
                const newUser = await UserAPI.uploadProfilePicture(authToken, file);
                setUser(user => ({ ...user, ...newUser }));
                setPfpCacheBust(Date.now());
                showToast(
                  'Profile photo uploaded!',
                  'The changes may take some time to show up on the website.'
                );
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

const getServerSidePropsFunc: GetServerSideProps<EditProfileProps> = async ({ req, res }) => {
  const AUTH_TOKEN = CookieService.getServerCookie(CookieType.ACCESS_TOKEN, { req, res });
  // Ensure `user` is up-to-date
  const user = await UserAPI.getCurrentUser(AUTH_TOKEN);

  return { props: { authToken: AUTH_TOKEN, user } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
