import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { PixelPanel } from '../components/PixelPanel';
import { useI18n } from '../i18n/I18nProvider';
import { authErrorToChinese } from '../utils/authErrorMessages';

const copy = {
  zh: {
    label: '创建学习档案',
    title: '给 TransBot 分配一张通行证',
    intro: '请使用邮箱注册。注册后，你的学习记录会保存到自己的账号里。',
    email: '邮箱',
    emailPlaceholder: '请输入常用邮箱',
    password: '密码',
    minPassword: '密码至少需要 8 位。',
    privacyTitle: '隐私保护说明',
    privacyBody:
      '我们会保存你的邮箱、可选个人资料、关卡完成状态、测验分数和错题/误区记录，用于展示个人学习进度。你的密码由 Supabase Auth 处理，本应用不会保存明文密码。每个用户只能访问自己的学习数据。',
    privacyAgree: '我已阅读并同意上述隐私保护说明。',
    privacyRequired: '请先阅读并勾选隐私保护说明，再创建学习档案。',
    submit: '注册',
    submitting: '正在注册...',
    verifyMessage:
      '注册已经提交。若 Supabase 当前开启了邮箱确认，请先打开邮箱完成验证；若已关闭邮箱确认，注册成功后会直接进入游戏。',
    login: '已有账号，去登录',
    failed: '注册失败',
  },
  en: {
    label: 'Create Learning Profile',
    title: 'Assign TransBot a pass',
    intro: 'Register with email. Your learning records will be saved to your own account.',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    password: 'Password',
    minPassword: 'Password must be at least 8 characters.',
    privacyTitle: 'Privacy Notice',
    privacyBody:
      'We save your email, optional profile fields, level completion status, quiz scores, and mistake or misconception records to show your personal learning progress. Passwords are handled by Supabase Auth; this app never stores plaintext passwords. Each user can only access their own learning data.',
    privacyAgree: 'I have read and agree to the privacy notice above.',
    privacyRequired: 'Please read and accept the privacy notice before creating your profile.',
    submit: 'Register',
    submitting: 'Registering...',
    verifyMessage:
      'Registration was submitted. If email confirmation is enabled in Supabase, please verify your email first. If confirmation is disabled, successful registration will take you into the game directly.',
    login: 'Already have an account? Sign in',
    failed: 'Registration failed',
  },
};

export function RegisterPage() {
  const { language } = useI18n();
  const text = copy[language];
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setMessage('');

    if (password.length < 8) {
      setErrorMessage(text.minPassword);
      return;
    }

    if (!hasAcceptedPrivacy) {
      setErrorMessage(text.privacyRequired);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signUp(email, password);

      if (result.hasSession) {
        navigate('/', { replace: true });
        return;
      }

      setMessage(text.verifyMessage);
    } catch (error) {
      const rawMessage = error instanceof Error ? error.message : text.failed;
      setErrorMessage(language === 'zh' ? authErrorToChinese(rawMessage) : rawMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <PixelPanel className="auth-panel">
        <p className="screen-label">{text.label}</p>
        <h1>{text.title}</h1>
        <p className="intro-text">{text.intro}</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {text.email}
            <input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder={text.emailPlaceholder}
              required
              type="email"
              value={email}
            />
          </label>
          <label>
            {text.password}
            <input
              autoComplete="new-password"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          <section className="privacy-consent" aria-label={text.privacyTitle}>
            <strong>{text.privacyTitle}</strong>
            <p>{text.privacyBody}</p>
            <label className="privacy-checkbox">
              <input
                checked={hasAcceptedPrivacy}
                onChange={(event) => setHasAcceptedPrivacy(event.target.checked)}
                type="checkbox"
              />
              <span>{text.privacyAgree}</span>
            </label>
          </section>

          {errorMessage ? <p className="form-message is-error">{errorMessage}</p> : null}
          {message ? <p className="form-message">{message}</p> : null}
          <button className="pixel-button" disabled={isSubmitting || !hasAcceptedPrivacy} type="submit">
            {isSubmitting ? text.submitting : text.submit}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">{text.login}</Link>
        </div>
      </PixelPanel>
    </main>
  );
}
