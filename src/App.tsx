import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './auth/useAuth';
import { LanguageToggle } from './components/LanguageToggle';
import { TransformerFlowLab } from './components/visual-lab/TransformerFlowLab';
import { practiceLevels } from './data/practiceLevels';
import { I18nProvider, useI18n } from './i18n/I18nProvider';
import { AchievementsPage } from './pages/AchievementsPage';
import { FinalChallengePage } from './pages/FinalChallengePage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { GamePage } from './pages/GamePage';
import { GlossaryPage } from './pages/GlossaryPage';
import { HomePage } from './pages/HomePage';
import { InterpreterModePage } from './pages/InterpreterModePage';
import { LoginPage } from './pages/LoginPage';
import { MistakeReviewPage } from './pages/MistakeReviewPage';
import { MyProgressPage } from './pages/MyProgressPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { PracticeSelectPage } from './pages/PracticeSelectPage';
import { ProfilePage } from './pages/ProfilePage';
import { QuizPage } from './pages/QuizPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SentenceLabPage } from './pages/SentenceLabPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import type { PageId } from './types/navigation';

const pagePaths: Record<PageId, string> = {
  home: '/',
  game: '/game',
  practice: '/practice',
  practiceGame: '/practice',
  visualLab: '/visual-lab',
  atlas: '/atlas',
  quiz: '/quiz',
  onboarding: '/onboarding',
  interpreter: '/interpreter',
  sentenceLab: '/sentence-lab',
  achievements: '/achievements',
  mistakeReview: '/mistake-review',
  finalChallenge: '/final-challenge',
  profile: '/profile',
  myProgress: '/my-progress',
  about: '/about',
};

function usePageNavigator() {
  const navigate = useNavigate();

  return (page: PageId) => {
    navigate(pagePaths[page]);
  };
}

function PracticeGameRoute() {
  const { levelId } = useParams();
  const onNavigate = usePageNavigator();
  const practiceLevel = practiceLevels.find((level) => level.id === levelId) ?? practiceLevels[0];

  return (
    <GamePage
      key={`practice-${practiceLevel.id}`}
      mode="practice"
      onNavigate={onNavigate}
      practiceLevel={practiceLevel}
    />
  );
}

function PracticeSelectRoute() {
  const navigate = useNavigate();
  const onNavigate = usePageNavigator();

  return (
    <PracticeSelectPage
      onNavigate={onNavigate}
      onStartPractice={(levelId) => navigate(`/practice/${levelId}`)}
    />
  );
}

function VisualLabRoute() {
  const onNavigate = usePageNavigator();

  return (
    <TransformerFlowLab
      levelId="standalone-full-transformer"
      levelTitle="完整 Transformer 流程"
      mode="campaign"
      onBackHome={() => onNavigate('home')}
      targetSequence={[
        'Token',
        'Embedding',
        'Position Encoding',
        'Multi-Head Attention',
        'Add & Norm',
        'Feed Forward',
        'Add & Norm',
        'Output',
      ]}
    />
  );
}

function AccountBar() {
  const { user, signOut } = useAuth();
  const { language } = useI18n();
  const navigate = useNavigate();
  const text =
    language === 'en'
      ? { aria: 'Account navigation', progress: 'My Progress', signOut: 'Sign Out' }
      : { aria: '账号导航', progress: '我的进度', signOut: '退出登录' };

  if (!user) {
    return null;
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="account-bar" aria-label={text.aria}>
      <Link to="/my-progress">{text.progress}</Link>
      <Link to="/profile">{user.email}</Link>
      <button onClick={handleSignOut} type="button">
        {text.signOut}
      </button>
    </nav>
  );
}

function ProtectedPage({ page }: { page: PageId }) {
  const onNavigate = usePageNavigator();

  if (page === 'home') {
    return <HomePage onNavigate={onNavigate} />;
  }

  if (page === 'game') {
    return <GamePage key="campaign" mode="campaign" onNavigate={onNavigate} />;
  }

  if (page === 'atlas') {
    return <GlossaryPage onNavigate={onNavigate} />;
  }

  if (page === 'quiz') {
    return <QuizPage onNavigate={onNavigate} />;
  }

  if (page === 'onboarding') {
    return <OnboardingPage onNavigate={onNavigate} />;
  }

  if (page === 'interpreter') {
    return <InterpreterModePage onNavigate={onNavigate} />;
  }

  if (page === 'sentenceLab') {
    return <SentenceLabPage onNavigate={onNavigate} />;
  }

  if (page === 'achievements') {
    return <AchievementsPage onNavigate={onNavigate} />;
  }

  if (page === 'mistakeReview') {
    return <MistakeReviewPage onNavigate={onNavigate} />;
  }

  if (page === 'finalChallenge') {
    return <FinalChallengePage onNavigate={onNavigate} />;
  }

  return <PlaceholderPage page="about" onNavigate={onNavigate} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute guestOnly>
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute guestOnly>
            <RegisterPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ProtectedRoute guestOnly>
            <ForgotPasswordPage />
          </ProtectedRoute>
        }
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {(
        [
          'home',
          'game',
          'atlas',
          'quiz',
          'onboarding',
          'interpreter',
          'sentenceLab',
          'achievements',
          'mistakeReview',
          'finalChallenge',
          'about',
        ] as PageId[]
      ).map((page) => (
        <Route
          element={
            <ProtectedRoute>
              <ProtectedPage page={page} />
            </ProtectedRoute>
          }
          key={page}
          path={pagePaths[page]}
        />
      ))}
      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <PracticeSelectRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/practice/:levelId"
        element={
          <ProtectedRoute>
            <PracticeGameRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visual-lab"
        element={
          <ProtectedRoute>
            <VisualLabRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-progress"
        element={
          <ProtectedRoute>
            <MyProgressPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <ProtectedPage page="about" />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <I18nProvider>
      <AccountBar />
      <LanguageToggle />
      <AppRoutes />
    </I18nProvider>
  );
}

export default App;
