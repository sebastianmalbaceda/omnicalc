/**
 * @omnicalc/desktop — Renderer Entry Point
 *
 * Simple calculator app for Electron desktop.
 * Uses vanilla JS to avoid bundler complexity.
 */

import './styles.css';
import {
  createCalculatorState,
  inputDigit,
  inputOperator,
  calculate,
  clear,
  backspace,
  toggleSign,
  memoryAdd,
  memoryRecall,
  memoryClear,
  scientificOperation,
  getDisplay,
  getExpression,
  type CalculatorState,
  type Operator,
  type ScientificFunction,
} from '@omnicalc/core-math';

interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  openExternal: (url: string) => Promise<void>;
  getPlatform: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

class CalculatorApp {
  private state: CalculatorState;
  private displayEl: HTMLElement | null;
  private expressionEl: HTMLElement | null;
  private isPro: boolean = true; // Desktop is Pro by default

  constructor() {
    this.state = createCalculatorState();
    this.displayEl = document.getElementById('display-value');
    this.expressionEl = document.getElementById('display-expression');
    this.render();
    this.attachEventListeners();
  }

  private render(): void {
    if (this.displayEl) {
      this.displayEl.textContent = getDisplay(this.state);
      this.displayEl.classList.toggle('error', this.state.display === 'Error');
    }
    if (this.expressionEl) {
      this.expressionEl.textContent = getExpression(this.state);
    }
  }

  private attachEventListeners(): void {
    // Numeric keypad
    document.querySelectorAll<HTMLButtonElement>('.btn-digit').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.state = inputDigit(this.state, btn.dataset.digit!);
        this.render();
      });
    });

    // Decimal point
    const decimalBtn = document.getElementById('btn-decimal');
    decimalBtn?.addEventListener('click', () => {
      this.state = inputDigit(this.state, '.');
      this.render();
    });

    // Operators
    document.querySelectorAll<HTMLButtonElement>('.btn-op').forEach((btn) => {
      btn.addEventListener('click', () => {
        const op = btn.dataset.op as Operator;
        this.state = inputOperator(this.state, op);
        this.render();
      });
    });

    // Scientific functions
    document.querySelectorAll<HTMLButtonElement>('.btn-fn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const fn = btn.dataset.fn as ScientificFunction;
        this.state = scientificOperation(this.state, fn);
        this.render();
      });
    });

    // Actions
    document.getElementById('btn-clear')?.addEventListener('click', () => {
      this.state = clear(this.state);
      this.render();
    });

    document.getElementById('btn-backspace')?.addEventListener('click', () => {
      this.state = backspace(this.state);
      this.render();
    });

    document.getElementById('btn-toggle-sign')?.addEventListener('click', () => {
      this.state = toggleSign(this.state);
      this.render();
    });

    document.getElementById('btn-equals')?.addEventListener('click', () => {
      this.state = calculate(this.state);
      this.render();
    });

    // Memory
    document.getElementById('btn-mc')?.addEventListener('click', () => {
      this.state = memoryClear(this.state);
      this.render();
    });

    document.getElementById('btn-mr')?.addEventListener('click', () => {
      this.state = memoryRecall(this.state);
      this.render();
    });

    document.getElementById('btn-m-plus')?.addEventListener('click', () => {
      this.state = memoryAdd(this.state);
      this.render();
    });

    // Theme toggle - defined outside to be accessible from initializeTheme
    const themeBtn = document.getElementById('btn-theme');

    const updateThemeButton = () => {
      if (themeBtn) {
        const isDark = document.documentElement.classList.contains('dark');
        themeBtn.textContent = isDark ? '☀️' : '🌙';
      }
    };

    themeBtn?.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        localStorage.theme = 'light';
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
      }
      updateThemeButton();
    });

    // Initialize theme button state
    updateThemeButton();

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        this.state = inputDigit(this.state, e.key);
      } else if (e.key === '.') {
        this.state = inputDigit(this.state, '.');
      } else if (e.key === '+') {
        this.state = inputOperator(this.state, '+');
      } else if (e.key === '-') {
        this.state = inputOperator(this.state, '-');
      } else if (e.key === '*') {
        this.state = inputOperator(this.state, '*');
      } else if (e.key === '/') {
        this.state = inputOperator(this.state, '/');
      } else if (e.key === 'Enter' || e.key === '=') {
        this.state = calculate(this.state);
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        this.state = clear(this.state);
      } else if (e.key === 'Backspace') {
        this.state = backspace(this.state);
      }
      this.render();
    });
  }
}

// Initialize theme from localStorage or system preference
function initializeTheme(): void {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
  // If no saved preference, let CSS media query handle it
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    new CalculatorApp();
  });
} else {
  initializeTheme();
  new CalculatorApp();
}
