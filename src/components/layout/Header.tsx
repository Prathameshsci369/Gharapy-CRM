'use client';
import { Bell, Search } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface HeaderProps {
    title: string;
    subtitle?: string;
    onMenuClick?: () => void;
}

export default function Header({ title, subtitle, onMenuClick }: HeaderProps) {
    return (
        <header style={{
            height: 60,
            background: 'var(--header-bg)',
            borderBottom: '1px solid var(--header-border)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px', gap: 12, flexShrink: 0,
            transition: 'background 0.2s, border 0.2s',
        }}>
            {/* Left: hamburger (mobile) + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Mobile hamburger */}
                <button
                    onClick={onMenuClick}
                    className="hide-desktop"
                    style={{
                        width: 36, height: 36, borderRadius: 8,
                        border: '1px solid var(--border)', background: 'var(--card)',
                        cursor: 'pointer', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 4,
                        flexShrink: 0,
                    }}
                >
                    <span style={{ width: 16, height: 2, background: 'var(--text-secondary)', borderRadius: 1 }} />
                    <span style={{ width: 16, height: 2, background: 'var(--text-secondary)', borderRadius: 1 }} />
                    <span style={{ width: 12, height: 2, background: 'var(--text-secondary)', borderRadius: 1 }} />
                </button>
                <div>
                    <h1 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{title}</h1>
                    {subtitle && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</p>}
                </div>
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Search bar (hidden on mobile) */}
                <div
                    className="hide-mobile"
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'var(--bg-alt)', border: '1px solid var(--border)',
                        borderRadius: 8, padding: '7px 12px', cursor: 'text', minWidth: 200,
                    }}
                >
                    <Search size={13} color="var(--text-muted)" />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Search leads...</span>
                    <kbd style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', background: 'var(--border)', borderRadius: 4, padding: '1px 5px' }}>⌘K</kbd>
                </div>

                {/* Notifications */}
                <button style={{
                    width: 38, height: 38, borderRadius: 8, border: '1px solid var(--border)',
                    background: 'var(--card)', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', position: 'relative',
                    color: 'var(--text-secondary)',
                    transition: 'background 0.15s',
                }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-alt)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'var(--card)')}
                >
                    <Bell size={15} />
                    <span style={{
                        position: 'absolute', top: 9, right: 9, width: 6, height: 6,
                        borderRadius: '50%', background: '#DC2626', border: '1.5px solid var(--card)',
                    }} />
                </button>

                {/* Dark mode toggle */}
                <ThemeToggle />

                {/* Admin chip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563EB, #6366F1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
                    }}>A</div>
                    <div className="hide-mobile" style={{ lineHeight: 1.3 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Admin</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Gharpayy</div>
                    </div>
                </div>
            </div>
        </header>
    );
}
