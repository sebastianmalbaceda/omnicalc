/**
 * @omnicalc/mobile — Calculator Store
 *
 * Zustand store that wraps the core-math calculator engine.
 * All UI interactions flow through this store.
 */

import { create } from 'zustand';
import {
  createCalculatorState,
  inputDigit,
  inputOperator,
  calculate,
  clear,
  clearEntry,
  toggleSign,
  percentageState,
  memoryAdd,
  memoryRecall,
  memoryClear,
  scientificOperation,
  inputParenthesis,
  backspace,
  clearHistory,
  getDisplay,
  getExpression,
  type CalculatorState,
  type Operator,
  type ScientificFunction,
  type HistoryEntry,
} from '@omnicalc/core-math';

interface CalculatorStore {
  state: CalculatorState;
  display: string;
  expression: string;
  isError: boolean;
  errorCode: string | null;
  history: HistoryEntry[];
  isPro: boolean;

  inputDigit: (digit: string) => void;
  inputOperator: (op: Operator) => void;
  calculate: () => void;
  clear: () => void;
  clearEntry: () => void;
  toggleSign: () => void;
  percentage: () => void;
  memoryAdd: () => void;
  memoryRecall: () => void;
  memoryClear: () => void;
  scientificOperation: (fn: ScientificFunction) => void;
  inputParenthesis: (parens: '(' | ')') => void;
  backspace: () => void;
  clearHistory: () => void;
  setPro: (isPro: boolean) => void;
  selectHistoryEntry: (entry: HistoryEntry) => void;
}

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  state: createCalculatorState(),
  display: '0',
  expression: '',
  isError: false,
  errorCode: null,
  history: [],
  isPro: false,

  inputDigit: (digit: string) => {
    const newState = inputDigit(get().state, digit);
    set({
      state: newState,
      display: getDisplay(newState),
      expression: getExpression(newState),
      isError: false,
      errorCode: null,
    });
  },

  inputOperator: (op: Operator) => {
    const newState = inputOperator(get().state, op);
    set({
      state: newState,
      display: getDisplay(newState),
      expression: getExpression(newState),
      isError: false,
      errorCode: null,
    });
  },

  calculate: () => {
    const newState = calculate(get().state);
    if (newState.display === 'Error') {
      set({
        state: newState,
        display: 'Error',
        isError: true,
        errorCode: 'UNKNOWN_ERROR',
        history: newState.history,
      });
    } else {
      set({
        state: newState,
        display: getDisplay(newState),
        expression: '',
        isError: false,
        errorCode: null,
        history: newState.history,
      });
    }
  },

  clear: () => {
    const newState = clear(get().state);
    set({
      state: newState,
      display: getDisplay(newState),
      expression: getExpression(newState),
      isError: false,
      errorCode: null,
    });
  },

  clearEntry: () => {
    const newState = clearEntry(get().state);
    set({
      state: newState,
      display: getDisplay(newState),
      expression: getExpression(newState),
      isError: false,
      errorCode: null,
    });
  },

  toggleSign: () => {
    const newState = toggleSign(get().state);
    set({
      state: newState,
      display: getDisplay(newState),
      expression: getExpression(newState),
      isError: false,
      errorCode: null,
    });
  },

  memoryAdd: () => {
    const newState = memoryAdd(get().state);
    set({
      state: newState,
      display: getDisplay(newState),
      expression: getExpression(newState),
    });
  },

  memoryRecall: () => {
    const newState = memoryRecall(get().state);
    set({
      state: newState,
      display: getDisplay(newState),
      expression: getExpression(newState),
    });
  },

  memoryClear: () => {
    const newState = memoryClear(get().state);
    set({
      state: newState,
      display: getDisplay(newState),
      expression: getExpression(newState),
    });
  },

  scientificOperation: (fn: ScientificFunction) => {
    const newState = scientificOperation(get().state, fn);
    if (newState.display === 'Error') {
      set({
        state: newState,
        display: 'Error',
        isError: true,
        errorCode: 'DOMAIN_ERROR',
      });
    } else {
      set({
        state: newState,
        display: getDisplay(newState),
        expression: getExpression(newState),
        isError: false,
        errorCode: null,
      });
    }
  },

  percentage: () => {
    const newState = percentageState(get().state);
    set({
      state: newState,
      display: getDisplay(newState),
      expression: getExpression(newState),
      isError: false,
      errorCode: null,
    });
  },

  inputParenthesis: (parens: '(' | ')') => {
    const newState = inputParenthesis(get().state, parens);
    set({
      state: newState,
      display: getDisplay(newState),
      expression: getExpression(newState),
    });
  },

  backspace: () => {
    const newState = backspace(get().state);
    set({
      state: newState,
      display: getDisplay(newState),
      expression: getExpression(newState),
      isError: false,
      errorCode: null,
    });
  },

  clearHistory: () => {
    const newState = clearHistory(get().state);
    set({
      state: newState,
      history: newState.history,
    });
  },

  setPro: (isPro: boolean) => {
    set({ isPro });
  },

  selectHistoryEntry: (entry: HistoryEntry) => {
    const newState = {
      ...get().state,
      display: entry.result,
      expression: '',
      waitingForOperand: true,
    };
    set({
      state: newState,
      display: getDisplay(newState),
      expression: '',
    });
  },
}));
