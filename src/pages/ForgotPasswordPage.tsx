import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { PixelPanel } from '../components/PixelPanel';
import { authErrorToChinese } from '../utils/authErrorMessages';

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setMessage('重置邮件已经发送。请打开邮箱里的链接，回到这里设置新密码。');
    } catch (error) {
      setErrorMessage(authErrorToChinese(error instanceof Error ? error.message : '发送失败'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <PixelPanel className="auth-panel">
        <p className="screen-label">找回通行证</p>
        <h1>重置你的学习入口</h1>
        <p className="intro-text">输入注册邮箱，Supabase 会给你发送一封安全的密码重置邮件。</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            邮箱
            <input autoComplete="email" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
          </label>
          {errorMessage ? <p className="form-message is-error">{errorMessage}</p> : null}
          {message ? <p className="form-message">{message}</p> : null}
          <button className="pixel-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? '正在发送...' : '发送重置邮件'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">返回登录</Link>
        </div>
      </PixelPanel>
    </main>
  );
}
