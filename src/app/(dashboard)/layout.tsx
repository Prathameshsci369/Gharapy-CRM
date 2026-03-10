'use client';
import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic imports with no SSR to reduce bundle size
const Sidebar = dynamic(() => import('@/components/layout/Sidebar'), { ssr: false });
const Header = dynamic(() => import('@/components/layout/Header'), { ssr: false });

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
    '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your operations' },
    '/leads': { title: 'Leads', subtitle: 'Manage and track all leads' },
    '/pipeline': { title: 'Pipeline', subtitle: 'Visual Kanban pipeline board' },
    '/visits': { title: 'Visit Scheduler', subtitle: 'Manage property visits' },
    '/agents': { title: 'Agents', subtitle: 'Team performance' },
    '/properties': { title: 'Properties', subtitle: 'Available PG listings' },
    '/reports': { title: 'Reports', subtitle: 'Analytics and insights' },
    '/settings': { title: 'Settings', subtitle: 'CRM configuration' },
    '/webhook-logs': { title: 'Webhook Logs', subtitle: 'Incoming webhook activity' },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const matched = Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key));
    const pageInfo = matched?.[1] || { title: 'Gharpayy CRM' };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
            <Sidebar
                mobileOpen={mobileMenuOpen}
                onMobileClose={() => setMobileMenuOpen(false)}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                <Header
                    title={pageInfo.title}
                    subtitle={pageInfo.subtitle}
                    onMenuClick={() => setMobileMenuOpen(true)}
                />
                <main style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
                    <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
