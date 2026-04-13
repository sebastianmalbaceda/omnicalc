import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../lib/auth';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export default function SignupPage() {
    const navigate = useNavigate();
    const setUser = useAuthStore((s) => s.setUser);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/sign-up/email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, name: name || undefined }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.message || 'Sign up failed');
                return;
            }
            const data = await res.json();
            if (data.user) {
                setUser(data.user);
            }
            navigate('/');
        }
        catch {
            setError('Something went wrong. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSocialLogin = (provider) => {
        window.location.href = `${API_URL}/api/auth/sign-in/${provider}`;
    };
    return (_jsx("div", { className: "min-h-screen bg-[#f7f9fb] dark:bg-[#0a0a0f] flex items-center justify-center px-4 py-12", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsx("button", { onClick: () => navigate('/'), className: "mb-6 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-[#392cc1] dark:hover:text-[#c3c0ff] transition-colors", children: "\u2190 Back to calculator" }), _jsxs("div", { className: "text-center mb-8", children: [_jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 mb-6", children: [_jsx("span", { className: "text-2xl text-[#392cc1] dark:text-[#c3c0ff]", children: "\u229E" }), _jsx("span", { className: "text-xl font-extrabold tracking-tighter text-[#392cc1] dark:text-[#c3c0ff]", children: "OmniCalc" })] }), _jsx("h1", { className: "text-2xl font-bold text-[#191c1e] dark:text-[#e8e8f0]", children: "Create your account" }), _jsxs("p", { className: "mt-2 text-sm text-gray-600 dark:text-gray-400", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "text-[#392cc1] dark:text-[#c3c0ff] hover:underline", children: "Sign in" })] })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && (_jsx("div", { className: "p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm", children: error })), _jsxs("div", { children: [_jsxs("label", { htmlFor: "name", className: "block text-sm font-medium mb-1 text-[#191c1e] dark:text-[#e8e8f0]", children: ["Name ", _jsx("span", { className: "text-gray-400", children: "(optional)" })] }), _jsx("input", { id: "name", type: "text", value: name, onChange: (e) => setName(e.target.value), className: "w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#252540] bg-white dark:bg-[#141420] text-[#191c1e] dark:text-[#e8e8f0] focus:outline-none focus:ring-2 focus:ring-[#392cc1]", placeholder: "John Doe" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium mb-1 text-[#191c1e] dark:text-[#e8e8f0]", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#252540] bg-white dark:bg-[#141420] text-[#191c1e] dark:text-[#e8e8f0] focus:outline-none focus:ring-2 focus:ring-[#392cc1]", placeholder: "you@example.com" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium mb-1 text-[#191c1e] dark:text-[#e8e8f0]", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 8, className: "w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#252540] bg-white dark:bg-[#141420] text-[#191c1e] dark:text-[#e8e8f0] focus:outline-none focus:ring-2 focus:ring-[#392cc1]", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-3 bg-[#392cc1] hover:bg-[#534ad9] disabled:opacity-50 text-white font-semibold rounded-full transition-colors", children: loading ? 'Creating account...' : 'Create Account' })] }), _jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-200 dark:border-[#252540]" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-[#f7f9fb] dark:bg-[#0a0a0f] text-gray-500", children: "Or continue with" }) })] }), _jsxs("div", { className: "mt-6 grid grid-cols-2 gap-3", children: [_jsxs("button", { type: "button", onClick: () => handleSocialLogin('google'), className: "flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-[#252540] rounded-lg hover:bg-gray-50 dark:hover:bg-[#141420] transition-colors bg-white dark:bg-[#141420] text-[#191c1e] dark:text-[#e8e8f0] text-sm font-medium", children: [_jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [_jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" }), _jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }), _jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }), _jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })] }), "Google"] }), _jsxs("button", { type: "button", onClick: () => handleSocialLogin('github'), className: "flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-[#252540] rounded-lg hover:bg-gray-50 dark:hover:bg-[#141420] transition-colors bg-white dark:bg-[#141420] text-[#191c1e] dark:text-[#e8e8f0] text-sm font-medium", children: [_jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" }) }), "GitHub"] })] })] })] }) }));
}
//# sourceMappingURL=SignupPage.js.map