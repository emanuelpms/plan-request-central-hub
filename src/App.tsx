
import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { UserProvider } from './context/UserContext';
import { ToastContainer } from './components/ui/Toast';
import { useToast } from './hooks/useToast';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and check for saved auth
    const timer = setTimeout(() => {
      const savedAuth = localStorage.getItem('miniescopo_auth');
      if (savedAuth) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-white text-3xl font-bold">MS</div>
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-white/30 animate-spin border-t-white"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sistema MiniEscopo</h2>
          <p className="text-white/80">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <UserProvider>
      <ToastContainer toasts={[]} onRemove={() => {}} />
      {isAuthenticated ? (
        <Dashboard onLogout={() => {
          setIsAuthenticated(false);
          localStorage.removeItem('miniescopo_auth');
        }} />
      ) : (
        <LoginScreen onLogin={() => setIsAuthenticated(true)} />
      )}
    </UserProvider>
  );
}

export default App;
