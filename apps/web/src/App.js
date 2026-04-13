import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsx(HashRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(CalculatorPage, { isDark: isDark, onToggleTheme: () => setIsDark(!isDark) }) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignupPage, {}) })] }) }));
}
//# sourceMappingURL=App.js.map