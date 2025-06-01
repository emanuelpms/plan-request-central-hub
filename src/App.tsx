
import { Toaster } from '@/components/ui/toaster';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import LoginForm from '@/components/LoginForm';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

function AppContent() {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
