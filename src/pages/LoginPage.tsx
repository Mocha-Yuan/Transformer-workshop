import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { PixelPanel } from '../components/PixelPanel';
import { useI18n } from '../i18n/I18nProvider';
import { authErrorToChinese } from '../utils/authErrorMessages';

const copy = {
  zh: {
    label: '学习工作台登录',
    title: '回到 Transformer 修复现场',
    intro: '用邮箱登录后，你的关卡进度会保存到自己的 Supabase 账户里。',
    email: '邮箱',
    emailPlaceholder: '请输入注册邮箱',
    password: '密码',
    minPassword: '密码至少需要 8 位。',
    submit: '登录',
    submitting: '正在登录...',
    register: '还没有账号？注册一个',
    forgot: '忘记密码',
    failed: '登录失败',
  },
  en: {
    label: 'Learning Desk Login',
    title: 'Return to the Transformer repair desk',
    intro: 'Sign in with your email to save level progress to your own Supabase account.',
    email: 'Email',
    emailPlaceholder: 'Enter your registered email',
    password: 'Password',
    minPassword: 'Password must be at least 8 characters.',
    submit: 'Sign In',
    submitting: 'Signing in...',
    register: 'No account yet? Create one',
    forgot: 'Forgot password',
    failed: 'Sign-in failed',
  },
};

export function LoginPage() {
  const { language } = useI18n();
  const text = copy[language];
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setErrorMessage(text.minPassword);
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
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
              autoComplete="current-password"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {errorMessage ? <p className="form-message is-error">{errorMessage}</p> : null}
          <button className="pixel-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? text.submitting : text.submit}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/register">{text.register}</Link>
          <Link to="/forgot-password">{text.forgot}</Link>
        </div>
      </PixelPanel>
    </main>
  );
}
