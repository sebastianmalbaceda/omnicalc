import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { useCalculatorStore } from '../stores/useCalculatorStore';
import { useAuthStore } from '../lib/auth';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export default function CalculatorPage({ isDark, onToggleTheme, }) {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { display, expression, isError, history, inputDigit, inputOperator, calculate, clear, backspace, toggleSign, percentage, memoryAdd, memoryRecall, memoryClear, clearHistory, selectHistoryEntry, } = useCalculatorStore();
    const { logout } = useAuthStore();
    const handleUpgradeToPro = async () => {
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
            if (data.url)
                window.location.href = data.url;
        }
        catch {
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
    const calcBtnBase = 'flex items-center justify-center rounded-xl active:scale-95 transition-all font-headline';
    const calcBtnSecondary = `${surfaceContainerHigh} ${onSurface} font-semibold`;
    const calcBtnOperator = 'bg-gradient-to-br from-[#392cc1] to-[#534ad9] text-white font-bold shadow-lg shadow-primary/30';
    const calcBtnFunction = `${surface} ${primaryText} font-semibold`;
    const calcBtnMemory = `${surfaceContainerHighest} ${onSurface} font-bold`;
    return (_jsxs("div", { className: `min-h-screen ${bg} flex flex-col`, children: [_jsxs("div", { className: "flex-row flex justify-between items-center px-6 pt-4 pb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[#392cc1] dark:text-[#c3c0ff] text-[24px]", children: "\u229E" }), _jsx("span", { className: `text-[20px] font-extrabold tracking-tighter ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'} font-headline`, children: "OmniCalc" }), _jsx("span", { className: "bg-[#6063ee] rounded-full px-2 py-0.5 ml-1", children: _jsx("span", { className: "text-[9px] font-bold tracking-widest uppercase text-white", children: user?.plan === 'pro' ? 'PRO' : 'FREE' }) })] }), _jsxs("div", { className: "flex items-center gap-3", children: [user ? (_jsxs(_Fragment, { children: [_jsx("span", { className: `text-[10px] font-bold ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'} max-w-[100px] truncate`, children: user.name || user.email }), user.plan !== 'pro' && (_jsx("button", { onClick: handleUpgradeToPro, className: `text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-[#c3c0ff]' : 'text-[#392cc1]'} hover:underline`, children: "Go Pro" })), _jsx("button", { onClick: logout, className: "text-[10px] font-semibold text-red-500 hover:text-red-600", children: "Sign Out" })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => navigate('/login'), className: `text-[9px] font-bold uppercase tracking-widest ${primaryText} hover:underline`, children: "Go Pro" }), _jsx("button", { onClick: () => navigate('/login'), className: `text-[10px] font-semibold ${primaryText} hover:underline`, children: "Sign In" })] })), _jsx("button", { onClick: onToggleTheme, className: `${surfaceContainerHigh} rounded-full w-8 h-8 flex items-center justify-center`, children: _jsx("span", { className: "text-[14px]", children: isDark ? '☀️' : '🌙' }) })] })] }), _jsxs("div", { className: "px-6 py-4 max-h-[180px] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-3 opacity-50", children: [_jsx("span", { className: `text-[10px] font-bold tracking-widest uppercase ${primaryText}`, children: "Cloud Tape History" }), history.length > 0 && (_jsx("button", { onClick: clearHistory, className: "text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider", children: "Clear" }))] }), history.length === 0 ? (_jsx("span", { className: `text-[12px] ${onSurfaceVariant}`, children: "No calculations yet" })) : (history
                        .slice(-5)
                        .reverse()
                        .map((entry, idx) => (_jsxs("button", { onClick: () => selectHistoryEntry(entry), className: `w-full text-right py-2 px-3 rounded-xl mb-2 ${idx % 2 === 0 ? (isDark ? 'bg-[#1a1a2e]' : 'bg-[#f2f4f6]') : ''}`, children: [_jsx("div", { className: `text-[11px] tracking-tight ${onSurfaceVariant}`, children: entry.expression }), _jsx("div", { className: `text-[16px] font-bold ${primaryText}`, children: entry.result })] }, entry.timestamp))))] }), _jsxs("div", { className: `px-6 pt-2 pb-6 text-right ${isDark ? 'bg-[#0a0a0f]' : 'bg-[#f7f9fb]'}`, children: [expression && (_jsx("div", { className: `text-[13px] ${onSurfaceVariant} opacity-60 mb-1 tracking-wide`, children: expression })), _jsx("div", { className: `text-[56px] font-extrabold tracking-tighter leading-none ${isError ? 'text-[#DC2626]' : onSurface}`, children: isError ? 'Error' : display })] }), _jsxs("div", { className: `flex-1 ${surfaceContainer} rounded-t-[40px] px-6 pt-6 pb-4`, children: [_jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("div", { className: "flex gap-3", children: [[
                                        { label: 'C', action: clear },
                                        { label: '±', action: toggleSign },
                                        { label: '%', action: percentage },
                                    ].map((btn) => (_jsx("button", { onClick: btn.action, className: `flex-1 h-14 ${calcBtnBase} ${calcBtnFunction}`, children: _jsx("span", { className: `text-[18px] font-bold ${primaryText}`, children: btn.label }) }, btn.label))), _jsx("button", { onClick: () => inputOperator('/'), className: `flex-1 h-14 ${calcBtnBase} ${calcBtnOperator}`, children: _jsx("span", { className: "text-[22px] font-bold text-white", children: "\u00F7" }) })] }), [
                                ['7', '8', '9', '*'],
                                ['4', '5', '6', '-'],
                                ['1', '2', '3', '+'],
                            ].map((row, rowIdx) => (_jsxs("div", { className: "flex gap-3", children: [row.slice(0, 3).map((d) => (_jsx("button", { onClick: () => inputDigit(d), className: `flex-1 h-14 ${calcBtnBase} ${calcBtnSecondary}`, children: _jsx("span", { className: `text-[20px] font-bold ${onSurface}`, children: d }) }, d))), _jsx("button", { onClick: () => inputOperator(row[3]), className: `flex-1 h-14 ${calcBtnBase} ${calcBtnOperator}`, children: _jsx("span", { className: "text-[22px] font-bold text-white", children: row[3] === '*' ? '×' : row[3] === '-' ? '−' : row[3] }) })] }, rowIdx))), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => inputDigit('0'), className: `flex-[2] h-14 ${calcBtnBase} ${calcBtnSecondary}`, children: _jsx("span", { className: `text-[20px] font-bold ${onSurface}`, children: "0" }) }), _jsx("button", { onClick: () => inputDigit('.'), className: `flex-1 h-14 ${calcBtnBase} ${calcBtnSecondary}`, children: _jsx("span", { className: `text-[20px] font-bold ${onSurface}`, children: "." }) }), _jsx("button", { onClick: calculate, className: `flex-1 h-14 ${calcBtnBase} ${calcBtnOperator}`, children: _jsx("span", { className: "text-[26px] font-bold text-white", children: "=" }) })] })] }), _jsx("div", { className: "flex gap-3 mt-4", children: [
                            { label: 'MC', action: memoryClear },
                            { label: 'MR', action: memoryRecall },
                            { label: 'M+', action: memoryAdd },
                            { label: '⌫', action: backspace },
                        ].map((btn) => (_jsx("button", { onClick: btn.action, className: `flex-1 h-10 ${calcBtnBase} ${calcBtnMemory}`, children: _jsx("span", { className: `text-[12px] font-bold ${onSurface}`, children: btn.label }) }, btn.label))) })] })] }));
}
//# sourceMappingURL=CalculatorPage.js.map