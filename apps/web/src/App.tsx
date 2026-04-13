import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from './lib/auth';
import CalculatorPage from './pages/CalculatorPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

export default function App() {
  const initAuth = useAuthStore((s) => s.init);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<CalculatorPage isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </HashRouter>
  );
}
