import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { PixelButton } from '../components/PixelButton';
import { PixelPanel } from '../components/PixelPanel';
import { useI18n } from '../i18n/I18nProvider';
import { getMyProfile, updateMyProfile, type Profile } from '../services/profileService';
import { authErrorToChinese } from '../utils/authErrorMessages';

const copy = {
  zh: {
    label: '个人资料',
    title: '你的 MTI 学习档案',
    intro: '这些信息都是非必填项，用来让学习记录更像一份自己的成长档案。',
    loading: '正在读取资料...',
    account: '邮箱',
    noAccount: '未读取到邮箱',
    displayName: '昵称',
    notSet: '还没有设置',
    displayNamePlaceholder: '例如：MTI Transformer 练习生',
    gender: '性别',
    genderEmpty: '不填写',
    female: '女',
    male: '男',
    nonBinary: '非二元',
    preferNot: '不便透露',
    major: '专业',
    majorPlaceholder: '例如：翻译硕士 MTI',
    grade: '年级',
    gradePlaceholder: '例如：研一 / 2025 级',
    school: '学校',
    schoolPlaceholder: '例如：某某大学',
    saved: '个人资料已经保存。',
    saveFailed: '保存失败',
    loadFailed: '读取资料失败',
    saving: '正在保存...',
    save: '保存个人资料',
    backHome: '返回主页',
    myProgress: '我的进度',
    signOut: '退出登录',
  },
  en: {
    label: 'Profile',
    title: 'Your MTI learning profile',
    intro: 'These fields are optional and help make your learning record feel like your own growth file.',
    loading: 'Loading profile...',
    account: 'Email',
    noAccount: 'No email found',
    displayName: 'Display name',
    notSet: 'Not set yet',
    displayNamePlaceholder: 'Example: MTI Transformer learner',
    gender: 'Gender',
    genderEmpty: 'Skip',
    female: 'Female',
    male: 'Male',
    nonBinary: 'Non-binary',
    preferNot: 'Prefer not to say',
    major: 'Major',
    majorPlaceholder: 'Example: MTI Translation',
    grade: 'Grade',
    gradePlaceholder: 'Example: Year 1 / Class of 2025',
    school: 'School',
    schoolPlaceholder: 'Example: Your university',
    saved: 'Profile saved.',
    saveFailed: 'Save failed',
    loadFailed: 'Failed to load profile',
    saving: 'Saving...',
    save: 'Save Profile',
    backHome: 'Back Home',
    myProgress: 'My Progress',
    signOut: 'Sign Out',
  },
};

export function ProfilePage() {
  const { language } = useI18n();
  const text = copy[language];
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [major, setMajor] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getMyProfile()
      .then((nextProfile) => {
        if (!isMounted) {
          return;
        }

        setProfile(nextProfile);
        setDisplayName(nextProfile.display_name ?? '');
        setGender(nextProfile.gender ?? '');
        setMajor(nextProfile.major ?? '');
        setGrade(nextProfile.grade ?? '');
        setSchool(nextProfile.school ?? '');
      })
      .catch((error) => {
        if (isMounted) {
          const rawMessage = error instanceof Error ? error.message : text.loadFailed;
          setErrorMessage(language === 'zh' ? authErrorToChinese(rawMessage) : rawMessage);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [language, text.loadFailed]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setMessage('');
    setIsSaving(true);

    try {
      const nextProfile = await updateMyProfile({
        displayName,
        gender,
        major,
        grade,
        school,
      });
      setProfile(nextProfile);
      setMessage(text.saved);
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : text.saveFailed;
      setErrorMessage(language === 'zh' ? authErrorToChinese(rawMessage) : rawMessage);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <main className="profile-page">
      <PixelPanel className="profile-panel">
        <p className="screen-label">{text.label}</p>
        <h1>{text.title}</h1>
        <p className="intro-text">{text.intro}</p>

        {isLoading ? (
          <p className="form-message">{text.loading}</p>
        ) : (
          <>
            <dl className="profile-summary">
              <div>
                <dt>{text.account}</dt>
                <dd>{profile?.email || user?.email || text.noAccount}</dd>
              </div>
              <div>
                <dt>{text.displayName}</dt>
                <dd>{profile?.display_name || text.notSet}</dd>
              </div>
            </dl>

            <form className="auth-form" onSubmit={handleSave}>
              <label>
                {text.displayName}
                <input
                  maxLength={40}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder={text.displayNamePlaceholder}
                  type="text"
                  value={displayName}
                />
              </label>

              <div className="profile-form-grid">
                <label>
                  {text.gender}
                  <select onChange={(event) => setGender(event.target.value)} value={gender}>
                    <option value="">{text.genderEmpty}</option>
                    <option value="female">{text.female}</option>
                    <option value="male">{text.male}</option>
                    <option value="non_binary">{text.nonBinary}</option>
                    <option value="prefer_not_to_say">{text.preferNot}</option>
                  </select>
                </label>
                <label>
                  {text.major}
                  <input
                    maxLength={60}
                    onChange={(event) => setMajor(event.target.value)}
                    placeholder={text.majorPlaceholder}
                    type="text"
                    value={major}
                  />
                </label>
                <label>
                  {text.grade}
                  <input
                    maxLength={40}
                    onChange={(event) => setGrade(event.target.value)}
                    placeholder={text.gradePlaceholder}
                    type="text"
                    value={grade}
                  />
                </label>
                <label>
                  {text.school}
                  <input
                    maxLength={80}
                    onChange={(event) => setSchool(event.target.value)}
                    placeholder={text.schoolPlaceholder}
                    type="text"
                    value={school}
                  />
                </label>
              </div>

              {errorMessage ? <p className="form-message is-error">{errorMessage}</p> : null}
              {message ? <p className="form-message">{message}</p> : null}
              <button className="pixel-button" disabled={isSaving} type="submit">
                {isSaving ? text.saving : text.save}
              </button>
            </form>
          </>
        )}

        <div className="profile-actions">
          <PixelButton onClick={() => navigate('/')}>{text.backHome}</PixelButton>
          <PixelButton onClick={() => navigate('/my-progress')}>{text.myProgress}</PixelButton>
          <PixelButton onClick={handleSignOut}>{text.signOut}</PixelButton>
        </div>
      </PixelPanel>
    </main>
  );
}
