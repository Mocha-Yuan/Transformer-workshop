import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../auth/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  guestOnly?: boolean;
}

export function ProtectedRoute({ children, guestOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="auth-loading-page">
        <div className="pixel-panel auth-loading-panel">
          <p className="screen-label">同步身份中</p>
          <h1>TransBot 正在校验通行证</h1>
          <p>稍等一下，学习工作台马上亮起来。</p>
        </div>
      </main>
    );
  }

  if (guestOnly && user) {
    return <Navigate replace to="/" />;
  }

  if (!guestOnly && !user) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <>{children}</>;
}
