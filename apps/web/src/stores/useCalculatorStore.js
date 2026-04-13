import { create } from 'zustand';
import { createCalculatorState, inputDigit as coreInputDigit, inputOperator as coreInputOperator, calculate as coreCalculate, clear as coreClear, backspace as coreBackspace, toggleSign as coreToggleSign, percentageState as corePercentage, memoryAdd as coreMemoryAdd, memoryRecall as coreMemoryRecall, memoryClear as coreMemoryClear, clearHistory as coreClearHistory, } from '@omnicalc/core-math';
export const useCalculatorStore = create((set, get) => {
    const initialState = createCalculatorState();
    function updateFromCore(newState) {
        set({
            coreState: newState,
            display: newState.display,
            expression: newState.expression,
            isError: newState.display === 'Error',
        });
    }
    return {
        coreState: initialState,
        display: initialState.display,
        expression: initialState.expression,
        isError: false,
        history: [],
        isPro: false,
        inputDigit: (digit) => {
            updateFromCore(coreInputDigit(get().coreState, digit));
        },
        inputOperator: (op) => {
            updateFromCore(coreInputOperator(get().coreState, op));
        },
        calculate: () => {
            const currentState = get().coreState;
            const prevHistoryLen = currentState.history.length;
            const newState = coreCalculate(currentState);
            if (newState.history.length > prevHistoryLen) {
                const lastEntry = newState.history[newState.history.length - 1];
                set((prev) => ({
                    coreState: newState,
                    display: newState.display,
                    expression: newState.expression,
                    isError: newState.display === 'Error',
                    history: [
                        ...prev.history,
                        {
                            expression: lastEntry.expression,
                            result: lastEntry.result,
                            timestamp: Date.now(),
                        },
                    ],
                }));
            }
            else {
                updateFromCore(newState);
            }
        },
        clear: () => {
            updateFromCore(coreClear(get().coreState));
        },
        backspace: () => {
            updateFromCore(coreBackspace(get().coreState));
        },
        toggleSign: () => {
            updateFromCore(coreToggleSign(get().coreState));
        },
        percentage: () => {
            updateFromCore(corePercentage(get().coreState));
        },
        memoryAdd: () => {
            updateFromCore(coreMemoryAdd(get().coreState));
        },
        memoryRecall: () => {
            updateFromCore(coreMemoryRecall(get().coreState));
        },
        memoryClear: () => {
            updateFromCore(coreMemoryClear(get().coreState));
        },
        clearHistory: () => {
            updateFromCore(coreClearHistory(get().coreState));
            set({ history: [] });
        },
        selectHistoryEntry: (entry) => {
            set({ display: entry.result, expression: entry.expression + ' =', isError: false });
        },
    };
});
//# sourceMappingURL=useCalculatorStore.js.map