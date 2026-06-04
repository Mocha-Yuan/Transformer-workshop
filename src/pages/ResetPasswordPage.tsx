import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { PixelPanel } from '../components/PixelPanel';
import { authErrorToChinese } from '../utils/authErrorMessages';

export function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setMessage('');

    if (password.length < 8) {
      setErrorMessage('新密码至少需要 8 位。');
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePassword(password);
      setMessage('密码已经更新，正在带你回到学习工作台。');
      window.setTimeout(() => navigate('/', { replace: true }), 900);
    } catch (error) {
      setErrorMessage(authErrorToChinese(error instanceof Error ? error.message : '密码更新失败'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <PixelPanel className="auth-panel">
        <p className="screen-label">设置新密码</p>
        <h1>重新点亮你的账号</h1>
        <p className="intro-text">请输入至少 8 位的新密码。完成后，你就可以继续保存学习进度。</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            新密码
            <input
              autoComplete="new-password"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {errorMessage ? <p className="form-message is-error">{errorMessage}</p> : null}
          {message ? <p className="form-message">{message}</p> : null}
          <button className="pixel-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? '正在更新...' : '更新密码'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">返回登录</Link>
        </div>
      </PixelPanel>
    </main>
  );
}
