import type { CalculatorState as CoreState } from '@omnicalc/core-math';
interface HistoryEntry {
    expression: string;
    result: string;
    timestamp: number;
}
interface CalculatorStore {
    coreState: CoreState;
    display: string;
    expression: string;
    isError: boolean;
    history: HistoryEntry[];
    isPro: boolean;
    inputDigit: (digit: string) => void;
    inputOperator: (op: string) => void;
    calculate: () => void;
    clear: () => void;
    backspace: () => void;
    toggleSign: () => void;
    percentage: () => void;
    memoryAdd: () => void;
    memoryRecall: () => void;
    memoryClear: () => void;
    clearHistory: () => void;
    selectHistoryEntry: (entry: HistoryEntry) => void;
}
export declare const useCalculatorStore: import("zustand").UseBoundStore<import("zustand").StoreApi<CalculatorStore>>;
export {};
//# sourceMappingURL=useCalculatorStore.d.ts.map