'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWebhookLogs, deleteWebhookLog } from '@/lib/firestore/webhook-logs';
import { Search, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function WebhookLogsPage() {
    const qc = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');

    const { data: logs = [], isLoading, error } = useQuery({
        queryKey: ['webhook_logs'],
        queryFn: () => getWebhookLogs(),
        refetchInterval: 5000, // Refetch every 5 seconds
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteWebhookLog(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['webhook_logs'] }),
    });

    const filtered = logs
        .filter(log => log.source.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(log => filterStatus === 'all' || log.status === filterStatus);

    if (error) return <div style={{ padding: 20, color: '#EF4444' }}>❌ Error loading webhook logs</div>;

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Webhook Logs</h1>
                    <p style={{ fontSize: 14, color: '#6B7280' }}>Monitor webhook ingestion and lead creation</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                    <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Total Webhooks</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{logs.length}</div>
                    </div>
                    <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Successful</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#10B981' }}>
                            {logs.filter(l => l.status === 'success').length}
                        </div>
                    </div>
                    <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>Failed</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#EF4444' }}>
                            {logs.filter(l => l.status === 'failed').length}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div style={{
                    background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #E5E7EB',
                    display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200,
                        background: '#FAFAFA', border: '1px solid #E5E7EB', borderRadius: 8,
                        padding: '6px 10px',
                    }}>
                        <Search size={16} color="#9CA3AF" />
                        <input
                            placeholder="Search by source..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{
                                flex: 1, border: 'none', outline: 'none', fontSize: 14,
                                background: 'transparent', color: '#111827',
                            }}
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value as any)}
                        style={{
                            padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB',
                            background: '#FAFAFA', fontSize: 13, color: '#111827',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>

                {/* Webhook Logs Table */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>Loading webhook logs...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40, color: '#9CA3AF' }}>No webhook logs found</div>
                ) : (
                    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Source</th>
                                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Status</th>
                                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Payload</th>
                                    <th style={{ textAlign: 'left', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Time</th>
                                    <th style={{ textAlign: 'center', padding: 12, fontSize: 12, fontWeight: 700, color: '#6B7280' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(log => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: 12, fontSize: 13, color: '#111827', fontWeight: 500 }}>{log.source}</td>
                                        <td style={{ padding: 12, fontSize: 13 }}>
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                                padding: '4px 8px', borderRadius: 6,
                                                background: log.status === 'success' ? '#D1FAE5' : '#FEE2E2',
                                                color: log.status === 'success' ? '#065F46' : '#991B1B',
                                                fontSize: 12, fontWeight: 600,
                                            }}>
                                                {log.status === 'success' ? (
                                                    <CheckCircle size={14} />
                                                ) : (
                                                    <AlertCircle size={14} />
                                                )}
                                                {log.status}
                                            </div>
                                        </td>
                                        <td style={{ padding: 12, fontSize: 12, color: '#6B7280', fontFamily: 'monospace' }}>
                                            <code>{JSON.stringify(log.payload).substring(0, 50)}...</code>
                                        </td>
                                        <td style={{ padding: 12, fontSize: 12, color: '#6B7280' }}>
                                            {format(new Date(log.createdAt), 'PPp')}
                                        </td>
                                        <td style={{ padding: 12, textAlign: 'center' }}>
                                            <button
                                                onClick={() => deleteMutation.mutate(log.id)}
                                                disabled={deleteMutation.isPending}
                                                style={{
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    color: '#EF4444', padding: 4,
                                                    opacity: deleteMutation.isPending ? 0.5 : 1,
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Webhook Integration Guide */}
                <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', padding: 20, marginTop: 32 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Webhook Integration Guide</h3>
                    <div style={{ background: '#F9FAFB', padding: 16, borderRadius: 8, marginBottom: 16, fontFamily: 'monospace', fontSize: 12 }}>
                        <div style={{ color: '#6B7280', marginBottom: 8 }}>Endpoint:</div>
                        <div style={{ color: '#111827', fontWeight: 600, marginBottom: 16 }}>
                            POST /api/webhook
                        </div>
                        <div style={{ color: '#6B7280', marginBottom: 8 }}>Headers:</div>
                        <div style={{ color: '#111827', fontWeight: 600 }}>
                            x-webhook-secret: {process.env.NEXT_PUBLIC_WEBHOOK_SECRET || 'your-webhook-secret'}
                        </div>
                    </div>
                    <div style={{ background: '#F9FAFB', padding: 16, borderRadius: 8, fontFamily: 'monospace', fontSize: 12 }}>
                        <div style={{ color: '#6B7280', marginBottom: 8 }}>Payload:</div>
                        <pre style={{ color: '#111827', margin: 0, overflow: 'auto' }}>
{`{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "source": "Tally Webhook",
  "notes": "Optional notes"
}`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
