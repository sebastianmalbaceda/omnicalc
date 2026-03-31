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

interface CalculatorPageProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function CalculatorPage({
  theme,
  toggleTheme,
}: CalculatorPageProps): React.ReactElement {
  const [state, setState] = useState<CalculatorState>(createCalculatorState());
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

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

  const handleInputPi = useCallback(() => {
    const newState = inputDigit(state, 'π');
    updateState(newState);
  }, [state, updateState]);

  const handleInputE = useCallback(() => {
    const newState = inputDigit(state, 'e');
    updateState(newState);
  }, [state, updateState]);

  const handlePower = useCallback(() => {
    const newState = inputOperator(state, '^');
    updateState(newState);
  }, [state, updateState]);

  const handleReciprocal = useCallback(() => {
    const newState = scientificOperation(state, 'reciprocal');
    updateState(newState);
  }, [state, updateState]);

  const handleInputParenthesis = useCallback(
    (parens: '(' | ')') => {
      const newState = inputDigit(state, parens);
      updateState(newState);
    },
    [state, updateState],
  );

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleSelectHistoryEntry = useCallback(
    (entry: HistoryEntry) => {
      const newState = {
        ...state,
        display: entry.result,
        expression: '',
        waitingForOperand: true,
      };
      updateState(newState);
    },
    [state, updateState],
  );

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen flex flex-col p-4 gap-4 ${isDark ? 'bg-[#0A0A0F]' : 'bg-[#FFFFFF]'}`}
    >
      <div className="flex flex-row justify-end">
        <button
          onClick={toggleTheme}
          className={`rounded-full px-4 py-2 ${isDark ? 'bg-[#141420]' : 'bg-[#FAFAFA]'}`}
        >
          <span className={`text-base ${isDark ? 'text-white' : 'text-[#505F76]'}`}>
            {isDark ? '☀️' : '🌙'}
          </span>
        </button>
      </div>

      <div className={`display flex-shrink-0 ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FAFAFA]'}`}>
        {expression && (
          <div className={`display-expression ${isDark ? 'text-[#A0A0B8]' : 'text-[#505F76]'}`}>
            {expression}
          </div>
        )}
        <div
          className={`display-value ${isError ? 'display-error' : isDark ? 'text-white' : 'text-[#1A1A2A]'}`}
        >
          {isError ? 'Error' : display}
        </div>
      </div>

      <div
        className={`flex-shrink-0 max-h-48 rounded-3xl p-4 ${isDark ? 'bg-[#1A1A2E]' : 'bg-[#FAFAFA]'}`}
      >
        {history.length > 0 ? (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm ${isDark ? 'text-[#A0A0B8]' : 'text-[#505F76]'}`}>
                History
              </span>
              <button onClick={handleClearHistory} className="text-xs text-tertiary-500">
                Clear
              </button>
            </div>
            {history
              .slice(-5)
              .reverse()
              .map((entry, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectHistoryEntry(entry)}
                  className={`text-left text-sm ${isDark ? 'text-[#A0A0B8]' : 'text-[#505F76]'}`}
                >
                  {entry.expression} = {entry.result}
                </button>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className={`text-sm ${isDark ? 'text-[#A0A0B8]' : 'text-[#505F76]'}`}>
              Cloud Tape Enabled (Pro)
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-row gap-3">
          {['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].map((fn) => (
            <button
              key={fn}
              onClick={() => handleScientificOperation(fn as ScientificFunction)}
              className="btn btn-function flex-1"
            >
              <span className="text-sm font-semibold">{fn}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-row gap-3">
          {[
            { label: 'π', action: handleInputPi },
            { label: 'e', action: handleInputE },
            { label: 'x²', action: () => handleScientificOperation('square') },
            { label: 'xⁿ', action: handlePower },
            { label: '1/x', action: handleReciprocal },
            { label: '()', action: () => handleInputParenthesis('(') },
          ].map((item) => (
            <button key={item.label} onClick={item.action} className="btn btn-function flex-1">
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-row gap-3">
          {[
            { label: 'MC', action: handleMemoryClear },
            { label: 'MR', action: handleMemoryRecall },
            { label: 'M+', action: handleMemoryAdd },
          ].map((item) => (
            <button key={item.label} onClick={item.action} className="btn btn-memory flex-1">
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-row gap-3">
            <button onClick={handleClear} className="btn btn-secondary flex-1">
              <span className="text-lg font-semibold">C</span>
            </button>
            <button onClick={handleToggleSign} className="btn btn-secondary flex-1">
              <span className="text-lg font-semibold">±</span>
            </button>
            <button onClick={handlePercentage} className="btn btn-secondary flex-1">
              <span className="text-lg font-semibold">%</span>
            </button>
            <button onClick={() => handleOperator('/')} className="btn btn-operator flex-1">
              <span className="text-lg font-semibold">÷</span>
            </button>
          </div>

          <div className="flex flex-row gap-3">
            {[7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleDigit(String(num))}
                className="btn btn-secondary flex-1"
              >
                <span className="text-xl font-semibold">{num}</span>
              </button>
            ))}
            <button onClick={() => handleOperator('*')} className="btn btn-operator flex-1">
              <span className="text-xl font-semibold">×</span>
            </button>
          </div>

          <div className="flex flex-row gap-3">
            {[4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => handleDigit(String(num))}
                className="btn btn-secondary flex-1"
              >
                <span className="text-xl font-semibold">{num}</span>
              </button>
            ))}
            <button onClick={() => handleOperator('-')} className="btn btn-operator flex-1">
              <span className="text-xl font-semibold">−</span>
            </button>
          </div>

          <div className="flex flex-row gap-3">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => handleDigit(String(num))}
                className="btn btn-secondary flex-1"
              >
                <span className="text-xl font-semibold">{num}</span>
              </button>
            ))}
            <button onClick={() => handleOperator('+')} className="btn btn-operator flex-1">
              <span className="text-xl font-semibold">+</span>
            </button>
          </div>

          <div className="flex flex-row gap-3">
            <button onClick={() => handleDigit('0')} className="btn btn-secondary flex-1">
              <span className="text-xl font-semibold">0</span>
            </button>
            <button onClick={() => handleDigit('.')} className="btn btn-secondary flex-1">
              <span className="text-xl font-semibold">.</span>
            </button>
            <button onClick={handleBackspace} className="btn btn-secondary flex-1">
              <span className="text-lg font-semibold">⌫</span>
            </button>
            <button onClick={handleCalculate} className="btn btn-primary flex-1">
              <span className="text-xl font-semibold">=</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
