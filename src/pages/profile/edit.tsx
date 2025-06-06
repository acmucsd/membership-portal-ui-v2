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
import withAccessType, { GetServerSidePropsWithAuth } from '@/lib/hoc/withAccessType';
import useConfirm from '@/lib/hooks/useConfirm';
import { CookieService, PermissionService } from '@/lib/services';
import { ExistingSocialMedia, SocialMedia } from '@/lib/types/apiRequests';
import { PrivateProfile } from '@/lib/types/apiResponses';
import { CookieType, SocialMediaType } from '@/lib/types/enums';
import { capitalize, fixUrl, getProfilePicture, reportError } from '@/lib/utils';
import DownloadIcon from '@/public/assets/icons/download-icon.svg';
import DropdownIcon from '@/public/assets/icons/dropdown-arrow-1.svg';
import styles from '@/styles/pages/EditProfile.module.scss';
import Link from 'next/link';
import { FormEvent, useEffect, useId, useMemo, useState } from 'react';

interface EditProfileProps {
  user: PrivateProfile;
  authToken: string;
}

const EditProfilePage = ({ user: initUser, authToken }: EditProfileProps) => {
  const [user, setUser] = useState(initUser);

  useEffect(() => {
    if (user !== initUser) {
      CookieService.setClientCookie(CookieType.USER, JSON.stringify(user), { maxAge: 5 * 60 });
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

  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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
    const newSocialMedia: SocialMedia[] = [];
    const updatedSocialMedia: ExistingSocialMedia[] = [];
    const deletedSocialMedia: ExistingSocialMedia[] = [];
    socialMedia.forEach((url: string, type: SocialMediaType) => {
      const social = user.userSocialMedia?.find(social => social.type === type);
      if (social?.url !== url) {
        // If there are changes to the social media at all...
        if (social) {
          if (url) {
            // Case 1: Social media existed before but has been changed.
            updatedSocialMedia.push({ type, uuid: social.uuid, url });
          } else {
            // Case 2: Social media existed before but doesn't exist now.
            deletedSocialMedia.push({ type, uuid: social.uuid, url });
          }
        } else if (url) {
          // Case 3: Social media didn't exist before but does exist now.
          newSocialMedia.push({ type, url });
        }
      }
    });

    const savedSocialMedia = new Map(
      user.userSocialMedia?.map(socialMedia => [socialMedia.type, socialMedia]) || []
    );

    if (newSocialMedia.length > 0) {
      try {
        const response = await UserAPI.insertSocialMedia(authToken, newSocialMedia);
        changed = true;
        response.forEach(socialMedia => savedSocialMedia.set(socialMedia.type, socialMedia));
      } catch (error) {
        const mediaList = newSocialMedia.map(({ type }) => capitalize(type)).join(', ');
        reportError(`Failed to update ${mediaList}`, error);
      }
    }

    if (updatedSocialMedia.length > 0) {
      try {
        const response = await UserAPI.updateSocialMedia(authToken, updatedSocialMedia);
        changed = true;
        response.forEach(socialMedia => savedSocialMedia.set(socialMedia.type, socialMedia));
      } catch (error) {
        const mediaList = updatedSocialMedia.map(({ type }) => capitalize(type)).join(', ');
        reportError(`Failed to update ${mediaList}`, error);
      }
    }

    if (deletedSocialMedia.length > 0) {
      // We do each of these indivdually.
      await Promise.all(
        deletedSocialMedia.map(async ({ type, uuid }) => {
          try {
            await UserAPI.deleteSocialMedia(authToken, uuid);
            savedSocialMedia.delete(type);
            changed = true;
          } catch (error) {
            reportError(`Failed to remove ${capitalize(type)}`, error);
          }
        })
      );
    }

    setUser(user => ({
      ...user,
      userSocialMedia: Array.from(savedSocialMedia.values()),
    }));

    if (changed) {
      showToast('Changes saved!');
      CookieService.setClientCookie(CookieType.USER, JSON.stringify(user), {
        maxAge: 5 * 60,
      });
    }
    setLoading(false);
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

  const confirmResumeDelete = useConfirm({
    title: 'Confirm resume deletion',
    question: 'Are you sure you want to delete your resume? This cannot be undone.',
    action: 'Delete',
  });
  const confirmResumeReplace = useConfirm({
    title: 'Confirm resume replacement',
    question: 'Are you sure you want to replace your resume? Your old resume will be lost forever.',
    action: 'Replace',
  });

  return (
    <>
      {confirmResumeDelete.modal}
      {confirmResumeReplace.modal}
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
                          onClick={() =>
                            confirmResumeDelete.confirm(async () => {
                              try {
                                await ResumeAPI.deleteResume(authToken, resume.uuid);
                                setResumes(resumes.filter(({ uuid }) => uuid !== resume.uuid));
                                showToast('Successfully deleted resume!');
                              } catch (error) {
                                reportError('Failed to delete resume', error);
                              }
                            })
                          }
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
                        onChange={e => {
                          const file = e.currentTarget.files?.[0];
                          e.currentTarget.value = '';
                          const uploadResume = async () => {
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
                          };
                          if (resumes.length > 0) {
                            confirmResumeReplace.confirm(uploadResume);
                          } else {
                            uploadResume();
                          }
                        }}
                      />
                      Upload New
                    </label>
                  </div>
                  <Switch
                    checked={isResumeVisible}
                    onCheck={checked => {
                      Promise.all(
                        resumes.map(async resume => {
                          const { isResumeVisible } = await ResumeAPI.uploadResumeVisibility(
                            authToken,
                            resume.uuid,
                            checked
                          );
                          return isResumeVisible;
                        })
                      )
                        .then((resumeVisibility: boolean[]) => {
                          if (resumeVisibility.length === 0) {
                            setIsResumeVisible(visible => !visible);
                          } else {
                            setIsResumeVisible(resumeVisibility.every(v => v));
                          }
                          showToast('Resume visibility preference saved!');
                        })
                        .catch(error => reportError('Failed to update resume visibility', error));
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
                    {isAttendancePublicChanged ? (
                      <span className={styles.unsavedChange}> (unsaved change)</span>
                    ) : null}
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
                disabled={!hasChange || loading}
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
            onClose={() => setPfp(null)}
          />
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;

const getServerSidePropsFunc: GetServerSidePropsWithAuth<EditProfileProps> = async ({
  req,
  res,
  authToken,
}) => {
  // Ensure `user` is up-to-date
  const user = await UserAPI.getFreshCurrentUserAndRefreshCookie(authToken, { req, res });

  return { props: { title: 'Edit Profile', authToken, user } };
};

export const getServerSideProps = withAccessType(
  getServerSidePropsFunc,
  PermissionService.loggedInUser
);
