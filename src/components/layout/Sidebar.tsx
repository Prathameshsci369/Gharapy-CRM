'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Users, GitBranch, CalendarDays,
    UserCircle, Building2, BarChart3, Settings, Webhook,
    ChevronLeft, ChevronRight, X, CheckCircle, MessageCircle, Clock, TrendingUp,
    History, Home, Package, Calendar, Zap, Target, Trophy, Activity,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/leads', label: 'Leads', icon: Users },
    { href: '/pipeline', label: 'Pipeline', icon: GitBranch },
    { href: '/visits', label: 'Visits', icon: CalendarDays },
    { href: '/bookings', label: 'Bookings', icon: CheckCircle },
    { href: '/conversations', label: 'Messages', icon: MessageCircle },
    { href: '/agents', label: 'Agents', icon: UserCircle },
    { href: '/properties', label: 'Properties', icon: Building2 },
    { href: '/reminders', label: 'Reminders', icon: Clock },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/analytics', label: 'Analytics', icon: TrendingUp },
    // New Pages
    { href: '/historical', label: 'Historical', icon: History },
    { href: '/owners', label: 'Owners', icon: Home },
    { href: '/inventory', label: 'Inventory', icon: Package },
    { href: '/availability', label: 'Availability', icon: Calendar },
    { href: '/effort', label: 'Effort', icon: Zap },
    { href: '/matching', label: 'Matching', icon: Target },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

const BOTTOM_ITEMS = [
    { href: '/webhook-logs', label: 'Webhook Logs', icon: Webhook },
    { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

function NavLink({ href, label, icon: Icon, collapsed, isActive }: {
    href: string; label: string; icon: React.ElementType;
    collapsed: boolean; isActive: boolean;
}) {
    return (
        <Link
            href={href}
            title={collapsed ? label : undefined}
            style={{
                display: 'flex', alignItems: 'center',
                gap: 10, padding: collapsed ? '10px' : '9px 12px',
                borderRadius: 8, textDecoration: 'none', fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--sidebar-active)' : 'transparent',
                transition: 'all 0.12s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
                whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'var(--sidebar-hover)'; }}
            onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
        >
            <Icon size={18} style={{ flexShrink: 0, color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
            {!collapsed && <span>{label}</span>}
        </Link>
    );
}

export default function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    const sidebarContent = (
        <aside style={{
            width: collapsed ? 64 : 240,
            minHeight: '100vh', height: '100%',
            background: 'var(--sidebar-bg)',
            borderRight: `1px solid var(--sidebar-border)`,
            display: 'flex', flexDirection: 'column',
            transition: 'width 0.2s ease',
            flexShrink: 0, position: 'relative', zIndex: 10,
        }}>
            {/* Logo */}
            <div style={{
                padding: collapsed ? '18px 0' : '18px 16px',
                borderBottom: `1px solid var(--sidebar-border)`,
                display: 'flex', alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'space-between', gap: 10,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg, #2563EB, #6366F1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: 15,
                    }}>G</div>
                    {!collapsed && (
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Gharpayy</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>CRM Dashboard</div>
                        </div>
                    )}
                </div>
                {/* Mobile close / collapse toggle */}
                {onMobileClose ? (
                    <button onClick={onMobileClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                        <X size={18} />
                    </button>
                ) : !collapsed ? (
                    <button onClick={() => setCollapsed(true)} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid var(--border)`, background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                        <ChevronLeft size={13} />
                    </button>
                ) : null}
                {collapsed && !onMobileClose && (
                    <button onClick={() => setCollapsed(false)} style={{ position: 'absolute', right: -11, top: 22, width: 22, height: 22, borderRadius: '50%', border: `1px solid var(--border)`, background: 'var(--card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', zIndex: 20 }}>
                        <ChevronRight size={11} />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {NAV_ITEMS.map(item => (
                    <NavLink key={item.href} {...item} collapsed={collapsed} isActive={isActive(item.href)} />
                ))}
            </nav>

            {/* Bottom */}
            <div style={{ padding: '8px', borderTop: `1px solid var(--sidebar-border)`, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {BOTTOM_ITEMS.map(item => (
                    <NavLink key={item.href} {...item} collapsed={collapsed} isActive={isActive(item.href)} />
                ))}
                {/* Brand chip */}
                {!collapsed && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', marginTop: 6, borderRadius: 8,
                        background: 'var(--bg-alt)', border: `1px solid var(--border)`,
                    }}>
                        <div style={{
                            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #2563EB, #6366F1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 600, fontSize: 12,
                        }}>G</div>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Gharpayy CRM</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Operations</div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <div className="hide-mobile">
                {sidebarContent}
            </div>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 200,
                        display: 'flex',
                    }}
                >
                    {/* Backdrop */}
                    <div
                        onClick={onMobileClose}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
                    />
                    {/* Sidebar panel */}
                    <div style={{ position: 'relative', zIndex: 201, maxWidth: 260, width: '80%', animation: 'slideIn 0.2s ease-out' }}>
                        <aside style={{
                            width: '100%', height: '100%', minHeight: '100vh',
                            background: 'var(--sidebar-bg)',
                            borderRight: `1px solid var(--sidebar-border)`,
                            display: 'flex', flexDirection: 'column',
                        }}>
                            {/* Logo+close on mobile */}
                            <div style={{ padding: '18px 16px', borderBottom: `1px solid var(--sidebar-border)`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #2563EB, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>G</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Gharpayy</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>CRM Dashboard</div>
                                    </div>
                                </div>
                                <button onClick={onMobileClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
                                    <X size={18} />
                                </button>
                            </div>
                            <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {NAV_ITEMS.map(item => (
                                    <NavLink key={item.href} {...item} collapsed={false} isActive={isActive(item.href)} />
                                ))}
                            </nav>
                            <div style={{ padding: '8px', borderTop: `1px solid var(--sidebar-border)`, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {BOTTOM_ITEMS.map(item => (
                                    <NavLink key={item.href} {...item} collapsed={false} isActive={isActive(item.href)} />
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            )}
        </>
    );
}
