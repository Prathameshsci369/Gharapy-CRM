'use client';
import { useState } from 'react';
import { Settings, Users, Webhook, Zap, ChevronRight, Plus, Trash2, Globe, Phone } from 'lucide-react';

const TABS = ['General', 'Agents', 'Lead Sources', 'Webhooks', 'Automations'];

const SAMPLE_SOURCES = ['WhatsApp', 'Website', 'Tally Webhook', 'Phone Call', 'Social Media', 'Walk-In', 'Referral'];
const SAMPLE_WEBHOOKS = [
    { id: 'w1', name: 'Tally Form', url: 'https://yourapp.vercel.app/api/webhook', secret: '••••••••', active: true },
    { id: 'w2', name: 'Website Form', url: 'https://yourapp.vercel.app/api/webhook', secret: '••••••••', active: false },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('General');

    return (
        <div style={{ display: 'flex', gap: 24 }}>
            {/* Sidebar tabs */}
            <div style={{
                width: 200, flexShrink: 0, background: '#fff',
                borderRadius: 16, border: '1px solid #E5E7EB', padding: 8,
                alignSelf: 'flex-start',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        width: '100%', textAlign: 'left', background: tab === activeTab ? '#EFF6FF' : 'none',
                        border: 'none', borderRadius: 8, padding: '10px 14px', cursor: 'pointer',
                        fontSize: 14, fontWeight: tab === activeTab ? 600 : 400,
                        color: tab === activeTab ? '#2563EB' : '#374151',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        transition: 'background 0.15s',
                    }}>
                        {tab}
                        {tab === activeTab && <ChevronRight size={14} />}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                {activeTab === 'General' && (
                    <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>General Settings</h2>
                        {[
                            { label: 'Organization Name', value: 'Gharpayy', placeholder: 'Company name' },
                            { label: 'City', value: 'Bangalore', placeholder: 'Operating city' },
                            { label: 'Support Email', value: 'support@gharpayy.com', placeholder: 'Support email' },
                            { label: 'Support Phone', value: '+91 9876543210', placeholder: 'Support phone' },
                        ].map(f => (
                            <div key={f.label}>
                                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>{f.label}</label>
                                <input
                                    defaultValue={f.value}
                                    placeholder={f.placeholder}
                                    style={{
                                        width: '100%', height: 40, borderRadius: 8, border: '1.5px solid #E5E7EB',
                                        padding: '0 12px', fontSize: 14, outline: 'none', background: '#FAFAFA',
                                    }}
                                    onFocus={e => (e.target.style.borderColor = '#2563EB')}
                                    onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                                />
                            </div>
                        ))}
                        <button style={{
                            alignSelf: 'flex-start', height: 40, padding: '0 20px', borderRadius: 8,
                            border: 'none', background: '#2563EB', color: '#fff', fontWeight: 600,
                            fontSize: 14, cursor: 'pointer',
                        }}>
                            Save Changes
                        </button>
                    </div>
                )}

                {activeTab === 'Lead Sources' && (
                    <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Lead Sources</h2>
                            <button style={{ height: 36, padding: '0 14px', borderRadius: 8, border: 'none', background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Plus size={14} /> Add Source
                            </button>
                        </div>
                        {SAMPLE_SOURCES.map(src => (
                            <div key={src} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '14px 16px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#F9FAFB',
                            }}>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <div style={{ width: 34, height: 34, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Globe size={16} color="#2563EB" />
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{src}</span>
                                </div>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', padding: 6 }}>
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'Webhooks' && (
                    <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Webhook Endpoints</h2>
                            <button style={{ height: 36, padding: '0 14px', borderRadius: 8, border: 'none', background: '#2563EB', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Plus size={14} /> Add Webhook
                            </button>
                        </div>

                        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
                            <strong>Webhook URL:</strong> <code style={{ background: '#FEF3C7', padding: '2px 6px', borderRadius: 4 }}>https://yourapp.vercel.app/api/webhook</code>
                            <br />
                            Send a POST request with <code style={{ background: '#FEF3C7', padding: '2px 6px', borderRadius: 4 }}>x-webhook-secret</code> header and JSON lead data.
                        </div>

                        {SAMPLE_WEBHOOKS.map(wh => (
                            <div key={wh.id} style={{ padding: '16px 18px', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: wh.active ? '#EFF6FF' : '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Webhook size={18} color={wh.active ? '#2563EB' : '#9CA3AF'} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{wh.name}</div>
                                        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{wh.url}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                                        background: wh.active ? '#F0FDF4' : '#F9FAFB',
                                        color: wh.active ? '#16A34A' : '#9CA3AF',
                                    }}>{wh.active ? 'Active' : 'Inactive'}</span>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}>
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'Automations' && (
                    <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Automation Rules</h2>
                        {[
                            { name: 'Auto-assign new leads', desc: 'Round-robin assignment to active agents', active: true },
                            { name: 'Follow-up reminder after 24h', desc: 'Remind agent if no update in 24 hours', active: true },
                            { name: 'Lost lead after 7 days inactivity', desc: 'Auto-move to Lost if no activity for 7 days', active: false },
                            { name: 'WhatsApp message on lead creation', desc: 'Send welcome message to new leads', active: false },
                        ].map(rule => (
                            <div key={rule.name} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '16px 18px', borderRadius: 12, border: '1px solid #E5E7EB',
                            }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: rule.active ? '#EFF6FF' : '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Zap size={16} color={rule.active ? '#2563EB' : '#9CA3AF'} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{rule.name}</div>
                                        <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{rule.desc}</div>
                                    </div>
                                </div>
                                <label style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer' }}>
                                    <input type="checkbox" defaultChecked={rule.active} style={{ opacity: 0, width: 0, height: 0 }} />
                                    <span style={{
                                        position: 'absolute', inset: 0, borderRadius: 999,
                                        background: rule.active ? '#2563EB' : '#E5E7EB', transition: 'background 0.2s',
                                        display: 'flex', alignItems: 'center', padding: '0 3px',
                                    }}>
                                        <span style={{
                                            width: 18, height: 18, borderRadius: '50%', background: '#fff',
                                            marginLeft: rule.active ? 20 : 0, transition: 'margin 0.2s',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                        }} />
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {(activeTab === 'Agents') && (
                    <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Agent Management</h2>
                        <p style={{ fontSize: 14, color: '#6B7280' }}>Manage agents from the <a href="/agents" style={{ color: '#2563EB' }}>Agents page</a>.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
