import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginPageProps {
  theme: 'light' | 'dark';
}

export default function LoginPage({ theme }: LoginPageProps): React.ReactElement {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDark = theme === 'dark';

  const handleSubmit = async (): Promise<void> => {
    setError('');
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/');
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-8 ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#FFFFFF]'}`}
    >
      <div
        className={`w-full max-w-sm p-8 rounded-3xl shadow-lg ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#F8FAFC]'}`}
      >
        <h1
          className={`text-3xl font-heading font-extrabold text-center mb-2 ${isDark ? 'text-white' : 'text-[#1A1A2A]'}`}
        >
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className={`text-center mb-8 ${isDark ? 'text-[#A0A0B8]' : 'text-[#505F76]'}`}>
          {isLogin ? 'Sign in to sync your cloud tape' : 'Join the math revolution'}
        </p>

        {error && (
          <div className="bg-red-500/10 p-4 rounded-xl mb-6">
            <p className="text-red-500 text-center text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-[#141420] text-white border-[#A0A0B8]/20' : 'bg-white text-[#1A1A2A] border-[#505F76]/20'}`}
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-[#141420] text-white border-[#A0A0B8]/20' : 'bg-white text-[#1A1A2A] border-[#505F76]/20'}`}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-[#141420] text-white border-[#A0A0B8]/20' : 'bg-white text-[#1A1A2A] border-[#505F76]/20'}`}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 mt-4 rounded-xl items-center justify-center transition-all ${
              loading
                ? 'bg-primary-400 opacity-70'
                : 'bg-primary-500 hover:bg-primary-600 active:scale-95'
            }`}
          >
            {loading ? (
              <span className="text-white">Loading...</span>
            ) : (
              <span className="text-white font-semibold uppercase tracking-wider">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </span>
            )}
          </button>
        </div>

        <button onClick={() => setIsLogin(!isLogin)} className="mt-6 w-full">
          <p className="text-center text-primary-500 text-sm">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </p>
        </button>

        <button onClick={() => navigate('/')} className="mt-4 w-full">
          <p className="text-center text-[#A0A0B8] text-sm">Continue as Guest</p>
        </button>
      </div>
    </div>
  );
}
