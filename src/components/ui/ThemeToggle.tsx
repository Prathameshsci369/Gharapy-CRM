'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            setDark(true);
        }
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        if (next) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <button
            onClick={toggle}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
                width: 38, height: 38, borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--card)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'background 0.15s, border 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-alt)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--card)')}
        >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    );
}
