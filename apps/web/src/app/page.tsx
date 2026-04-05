'use client';

import React, { useState, useCallback } from 'react';
import type { Operator, ScientificFunction, HistoryEntry } from '@omnicalc/core-math';
import {
  createCalculatorState,
  inputDigit,
  inputOperator,
  calculate,
  clear,
  backspace,
  toggleSign,
  percentageState,
  memoryAdd,
  memoryRecall,
  memoryClear,
  scientificOperation,
  getDisplay,
  getExpression,
  type CalculatorState,
} from '@omnicalc/core-math';

export default function HomePage(): React.ReactElement {
  const [state, setState] = useState<CalculatorState>(createCalculatorState());
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isDark, setIsDark] = useState(false);

  const updateState = useCallback((newState: CalculatorState, showError = false) => {
    setState(newState);
    setDisplay(getDisplay(newState));
    setExpression(getExpression(newState));
    if (newState.display === 'Error' || showError) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    if (newState.history) {
      setHistory(newState.history);
    }
  }, []);

  const handleDigit = useCallback(
    (digit: string) => {
      const newState = inputDigit(state, digit);
      updateState(newState);
    },
    [state, updateState],
  );

  const handleOperator = useCallback(
    (op: Operator) => {
      const newState = inputOperator(state, op);
      updateState(newState);
    },
    [state, updateState],
  );

  const handleCalculate = useCallback(() => {
    const newState = calculate(state);
    updateState(newState, newState.display === 'Error');
  }, [state, updateState]);

  const handleClear = useCallback(() => {
    const newState = clear(state);
    updateState(newState);
  }, [state, updateState]);

  const handleBackspace = useCallback(() => {
    const newState = backspace(state);
    updateState(newState);
  }, [state, updateState]);

  const handleToggleSign = useCallback(() => {
    const newState = toggleSign(state);
    updateState(newState);
  }, [state, updateState]);

  const handlePercentage = useCallback(() => {
    const newState = percentageState(state);
    updateState(newState);
  }, [state, updateState]);

  const handleMemoryAdd = useCallback(() => {
    const newState = memoryAdd(state);
    updateState(newState);
  }, [state, updateState]);

  const handleMemoryRecall = useCallback(() => {
    const newState = memoryRecall(state);
    updateState(newState);
  }, [state, updateState]);

  const handleMemoryClear = useCallback(() => {
    const newState = memoryClear(state);
    updateState(newState);
  }, [state, updateState]);

  const handleScientificOperation = useCallback(
    (fn: ScientificFunction) => {
      const newState = scientificOperation(state, fn);
      updateState(newState, newState.display === 'Error');
    },
    [state, updateState],
  );

  const bg = isDark ? 'bg-[#0a0a0f]' : 'bg-[#f7f9fb]';
  const surfaceLowest = isDark ? 'bg-[#141420]' : 'bg-[#ffffff]';
  const surface = isDark ? 'bg-[#0a0a0f]' : 'bg-[#f7f9fb]';
  const surfaceContainer = isDark ? 'bg-[#141420]' : 'bg-[#eceef0]';
  const surfaceContainerHigh = isDark ? 'bg-[#1e1e32]' : 'bg-[#e6e8ea]';
  const surfaceContainerHighest = isDark ? 'bg-[#252540]' : 'bg-[#e0e3e5]';
  const onSurface = isDark ? 'text-[#e8e8f0]' : 'text-[#191c1e]';
  const primaryText = isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]';

  const calcBtnBase =
    'flex items-center justify-center rounded-xl active:scale-95 transition-all font-headline h-14';
  const calcBtnSecondary = `${surfaceContainerHigh} ${onSurface} font-semibold`;
  const calcBtnOperator =
    'bg-gradient-to-br from-[#392cc1] to-[#534ad9] text-white font-bold shadow-lg shadow-primary/30';
  const calcBtnFunction = `${surfaceLowest} ${primaryText} font-semibold`;

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>
      <header className="flex justify-between items-center px-6 py-4 sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-3">
          <span className={`${primaryText} text-2xl`}>⊞</span>
          <h1 className={`text-2xl font-extrabold tracking-tighter ${primaryText} font-headline`}>
            OmniCalc
          </h1>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className={`${surfaceContainerHigh} rounded-full w-8 h-8 flex items-center justify-center`}
        >
          <span className="text-[14px]">{isDark ? '☀️' : '🌙'}</span>
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div
          className={`w-full max-w-md ${surfaceLowest} rounded-[2rem] shadow-2xl flex flex-col overflow-hidden`}
        >
          <div className={`p-8 pb-10 flex flex-col items-end justify-end space-y-2 ${surface}`}>
            {expression && (
              <div
                className={`${isDark ? 'text-[#a0a0b8]' : 'text-[#464555]'} font-label text-sm tracking-wide opacity-60`}
              >
                {expression}
              </div>
            )}
            <div
              className={`text-6xl md:text-7xl font-headline font-extrabold tracking-tighter ${isError ? 'text-[#DC2626]' : onSurface}`}
            >
              {isError ? 'Error' : display}
            </div>
          </div>

          <div className={`p-6 ${surfaceContainer} rounded-t-[2.5rem]`}>
            <div className="grid grid-cols-4 gap-4">
              <button onClick={handleClear} className={`${calcBtnBase} ${calcBtnFunction}`}>
                <span className={`text-xl font-bold ${primaryText}`}>C</span>
              </button>
              <button onClick={handleToggleSign} className={`${calcBtnBase} ${calcBtnFunction}`}>
                <span className={`text-xl font-bold ${primaryText}`}>±</span>
              </button>
              <button onClick={handlePercentage} className={`${calcBtnBase} ${calcBtnFunction}`}>
                <span className={`text-xl font-bold ${primaryText}`}>%</span>
              </button>
              <button
                onClick={() => handleOperator('/')}
                className={`${calcBtnBase} ${calcBtnOperator}`}
              >
                <span className="text-2xl font-bold text-white">÷</span>
              </button>

              {['7', '8', '9'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDigit(d)}
                  className={`${calcBtnBase} ${calcBtnSecondary}`}
                >
                  <span className={`text-2xl font-semibold ${onSurface}`}>{d}</span>
                </button>
              ))}
              <button
                onClick={() => handleOperator('*')}
                className={`${calcBtnBase} ${calcBtnOperator}`}
              >
                <span className="text-2xl font-bold text-white">×</span>
              </button>

              {['4', '5', '6'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDigit(d)}
                  className={`${calcBtnBase} ${calcBtnSecondary}`}
                >
                  <span className={`text-2xl font-semibold ${onSurface}`}>{d}</span>
                </button>
              ))}
              <button
                onClick={() => handleOperator('-')}
                className={`${calcBtnBase} ${calcBtnOperator}`}
              >
                <span className="text-2xl font-bold text-white">−</span>
              </button>

              {['1', '2', '3'].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDigit(d)}
                  className={`${calcBtnBase} ${calcBtnSecondary}`}
                >
                  <span className={`text-2xl font-semibold ${onSurface}`}>{d}</span>
                </button>
              ))}
              <button
                onClick={() => handleOperator('+')}
                className={`${calcBtnBase} ${calcBtnOperator}`}
              >
                <span className="text-2xl font-bold text-white">+</span>
              </button>

              <button
                onClick={() => handleDigit('0')}
                className={`col-span-2 flex items-center px-8 h-14 ${calcBtnBase} ${calcBtnSecondary}`}
              >
                <span className={`text-2xl font-semibold ${onSurface}`}>0</span>
              </button>
              <button
                onClick={() => handleDigit('.')}
                className={`${calcBtnBase} ${calcBtnSecondary}`}
              >
                <span className={`text-2xl font-semibold ${onSurface}`}>.</span>
              </button>
              <button
                onClick={handleCalculate}
                className={`${calcBtnBase} ${calcBtnOperator} text-3xl shadow-lg shadow-indigo-200`}
              >
                <span className="text-3xl font-bold text-white">=</span>
              </button>
            </div>

            <div className="flex gap-2 mt-8">
              <button
                onClick={handleMemoryClear}
                className={`flex-1 h-10 ${calcBtnBase} ${surfaceContainerHighest} ${onSurface} font-bold`}
              >
                <span className="text-[12px] font-bold">MC</span>
              </button>
              <button
                onClick={handleMemoryRecall}
                className={`flex-1 h-10 ${calcBtnBase} ${surfaceContainerHighest} ${onSurface} font-bold`}
              >
                <span className="text-[12px] font-bold">MR</span>
              </button>
              <button
                onClick={handleMemoryAdd}
                className={`flex-1 h-10 ${calcBtnBase} ${surfaceContainerHighest} ${onSurface} font-bold`}
              >
                <span className="text-[12px] font-bold">M+</span>
              </button>
              <button
                onClick={handleBackspace}
                className={`flex-1 h-10 ${calcBtnBase} ${surfaceContainerHighest} ${onSurface} font-bold`}
              >
                <span className="text-[12px] font-bold">⌫</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
