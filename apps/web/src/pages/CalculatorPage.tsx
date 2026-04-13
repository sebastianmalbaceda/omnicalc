import { useNavigate } from 'react-router-dom';
import { useCalculatorStore } from '../stores/useCalculatorStore';
import { useAuthStore } from '../lib/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function CalculatorPage({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    display,
    expression,
    isError,
    history,
    inputDigit,
    inputOperator,
    calculate,
    clear,
    backspace,
    toggleSign,
    percentage,
    memoryAdd,
    memoryRecall,
    memoryClear,
    clearHistory,
    selectHistoryEntry,
  } = useCalculatorStore();

  const { logout } = useAuthStore();

  const handleUpgradeToPro = async (): Promise<void> => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/payments/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      /* non-critical */
    }
  };

  const bg = isDark ? 'bg-[#0a0a0f]' : 'bg-[#f7f9fb]';
  const surface = isDark ? 'bg-[#141420]' : 'bg-[#ffffff]';
  const surfaceContainer = isDark ? 'bg-[#1a1a2e]' : 'bg-[#eceef0]';
  const surfaceContainerHigh = isDark ? 'bg-[#1e1e32]' : 'bg-[#e6e8ea]';
  const surfaceContainerHighest = isDark ? 'bg-[#252540]' : 'bg-[#e0e3e5]';
  const onSurface = isDark ? 'text-[#e8e8f0]' : 'text-[#191c1e]';
  const onSurfaceVariant = isDark ? 'text-[#a0a0b8]' : 'text-[#464555]';
  const primaryText = isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]';

  const calcBtnBase =
    'flex items-center justify-center rounded-xl active:scale-95 transition-all font-headline';
  const calcBtnSecondary = `${surfaceContainerHigh} ${onSurface} font-semibold`;
  const calcBtnOperator =
    'bg-gradient-to-br from-[#392cc1] to-[#534ad9] text-white font-bold shadow-lg shadow-primary/30';
  const calcBtnFunction = `${surface} ${primaryText} font-semibold`;
  const calcBtnMemory = `${surfaceContainerHighest} ${onSurface} font-bold`;

  return (
    <div className={`min-h-screen ${bg} flex flex-col`}>
      {/* Top Bar */}
      <div className="flex-row flex justify-between items-center px-6 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[#392cc1] dark:text-[#c3c0ff] text-[24px]">⊞</span>
          <span
            className={`text-[20px] font-extrabold tracking-tighter ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'} font-headline`}
          >
            OmniCalc
          </span>
          <span className="bg-[#6063ee] rounded-full px-2 py-0.5 ml-1">
            <span className="text-[9px] font-bold tracking-widest uppercase text-white">
              {user?.plan === 'pro' ? 'PRO' : 'FREE'}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span
                className={`text-[10px] font-bold ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'} max-w-[100px] truncate`}
              >
                {user.name || user.email}
              </span>
              {user.plan !== 'pro' && (
                <button
                  onClick={handleUpgradeToPro}
                  className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'} hover:underline`}
                >
                  Go Pro
                </button>
              )}
              <button
                onClick={logout}
                className="text-[10px] font-semibold text-red-500 hover:text-red-600"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className={`text-[9px] font-bold uppercase tracking-widest ${primaryText} hover:underline`}
              >
                Go Pro
              </button>
              <button
                onClick={() => navigate('/login')}
                className={`text-[10px] font-semibold ${primaryText} hover:underline`}
              >
                Sign In
              </button>
            </>
          )}
          <button
            onClick={onToggleTheme}
            className={`${surfaceContainerHigh} rounded-full w-8 h-8 flex items-center justify-center`}
          >
            <span className="text-[14px]">{isDark ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </div>

      {/* History */}
      <div className="px-6 py-4 max-h-[180px] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 opacity-50">
          <span className={`text-[10px] font-bold tracking-widest uppercase ${primaryText}`}>
            Cloud Tape History
          </span>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider"
            >
              Clear
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <span className={`text-[12px] ${onSurfaceVariant}`}>No calculations yet</span>
        ) : (
          history
            .slice(-5)
            .reverse()
            .map((entry, idx) => (
              <button
                key={entry.timestamp}
                onClick={() => selectHistoryEntry(entry)}
                className={`w-full text-right py-2 px-3 rounded-xl mb-2 ${idx % 2 === 0 ? (isDark ? 'bg-[#1a1a2e]' : 'bg-[#f2f4f6]') : ''}`}
              >
                <div className={`text-[11px] tracking-tight ${onSurfaceVariant}`}>
                  {entry.expression}
                </div>
                <div className={`text-[16px] font-bold ${primaryText}`}>{entry.result}</div>
              </button>
            ))
        )}
      </div>

      {/* Display */}
      <div className={`px-6 pt-2 pb-6 text-right ${isDark ? 'bg-[#0a0a0f]' : 'bg-[#f7f9fb]'}`}>
        {expression && (
          <div className={`text-[13px] ${onSurfaceVariant} opacity-60 mb-1 tracking-wide`}>
            {expression}
          </div>
        )}
        <div
          className={`text-[56px] font-extrabold tracking-tighter leading-none ${isError ? 'text-[#DC2626]' : onSurface}`}
        >
          {isError ? 'Error' : display}
        </div>
      </div>

      {/* Keypad */}
      <div className={`flex-1 ${surfaceContainer} rounded-t-[40px] px-6 pt-6 pb-4`}>
        <div className="flex flex-col gap-3">
          {/* Row 1: C, ±, %, ÷ */}
          <div className="flex gap-3">
            {[
              { label: 'C', action: clear },
              { label: '±', action: toggleSign },
              { label: '%', action: percentage },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className={`flex-1 h-14 ${calcBtnBase} ${calcBtnFunction}`}
              >
                <span className={`text-[18px] font-bold ${primaryText}`}>{btn.label}</span>
              </button>
            ))}
            <button
              onClick={() => inputOperator('/')}
              className={`flex-1 h-14 ${calcBtnBase} ${calcBtnOperator}`}
            >
              <span className="text-[22px] font-bold text-white">÷</span>
            </button>
          </div>

          {/* Rows 2-4: Numbers + operators */}
          {[
            ['7', '8', '9', '*'] as const,
            ['4', '5', '6', '-'] as const,
            ['1', '2', '3', '+'] as const,
          ].map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-3">
              {row.slice(0, 3).map((d) => (
                <button
                  key={d}
                  onClick={() => inputDigit(d)}
                  className={`flex-1 h-14 ${calcBtnBase} ${calcBtnSecondary}`}
                >
                  <span className={`text-[20px] font-bold ${onSurface}`}>{d}</span>
                </button>
              ))}
              <button
                onClick={() => inputOperator(row[3])}
                className={`flex-1 h-14 ${calcBtnBase} ${calcBtnOperator}`}
              >
                <span className="text-[22px] font-bold text-white">
                  {row[3] === '*' ? '×' : row[3] === '-' ? '−' : row[3]}
                </span>
              </button>
            </div>
          ))}

          {/* Row 5: 0, ., = */}
          <div className="flex gap-3">
            <button
              onClick={() => inputDigit('0')}
              className={`flex-[2] h-14 ${calcBtnBase} ${calcBtnSecondary}`}
            >
              <span className={`text-[20px] font-bold ${onSurface}`}>0</span>
            </button>
            <button
              onClick={() => inputDigit('.')}
              className={`flex-1 h-14 ${calcBtnBase} ${calcBtnSecondary}`}
            >
              <span className={`text-[20px] font-bold ${onSurface}`}>.</span>
            </button>
            <button onClick={calculate} className={`flex-1 h-14 ${calcBtnBase} ${calcBtnOperator}`}>
              <span className="text-[26px] font-bold text-white">=</span>
            </button>
          </div>
        </div>

        {/* Memory row */}
        <div className="flex gap-3 mt-4">
          {[
            { label: 'MC', action: memoryClear },
            { label: 'MR', action: memoryRecall },
            { label: 'M+', action: memoryAdd },
            { label: '⌫', action: backspace },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              className={`flex-1 h-10 ${calcBtnBase} ${calcBtnMemory}`}
            >
              <span className={`text-[12px] font-bold ${onSurface}`}>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
