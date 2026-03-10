'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReminders, updateReminder, deleteReminder, createReminder } from '@/lib/firestore/reminders';
import { getLeads } from '@/lib/firestore/leads';
import { Bell, Trash2, CheckCircle, Clock, Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function RemindersPage() {
    const qc = useQueryClient();
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        leadId: '',
        agentId: '',
        message: '',
        dueDate: '',
    });

    const { data: reminders = [] } = useQuery({
        queryKey: ['reminders'],
        queryFn: () => getReminders(),
        refetchInterval: 30000,
    });

    const { data: leads = [] } = useQuery({
        queryKey: ['leads'],
        queryFn: () => getLeads(),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<any> }) => updateReminder(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteReminder(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => createReminder(data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['reminders'] });
            setShowAddForm(false);
            setFormData({ leadId: '', agentId: '', message: '', dueDate: '' });
        },
    });

    const pendingReminders = reminders.filter(r => r.status === 'pending');
    const completedReminders = reminders.filter(r => r.status === 'done');

    const handleAddReminder = () => {
        if (!formData.leadId || !formData.agentId || !formData.message) return;
        createMutation.mutate({
            ...formData,
            dueDate: new Date(formData.dueDate),
            status: 'pending',
        });
    };

    return (
        <div style={{ padding: 24, background: '#FAFAFA', minHeight: '100vh' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Reminders</h1>
                        <p style={{ fontSize: 14, color: '#6B7280' }}>Follow-up reminders for leads</p>
                    </div>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 16px', background: '#2563EB', color: '#fff',
                            border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                            fontSize: 14,
                        }}
                    >
                        <Plus size={18} /> Add Reminder
                    </button>
                </div>

                {/* Add Form */}
                {showAddForm && (
                    <div style={{
                        background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
                        padding: 20, marginBottom: 24,
                    }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Create Reminder</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                            <select
                                value={formData.leadId}
                                onChange={e => setFormData({ ...formData, leadId: e.target.value })}
                                style={{
                                    padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB',
                                    background: '#FAFAFA', fontSize: 14, color: '#111827',
                                }}
                            >
                                <option value="">Select Lead</option>
                                {leads.map(lead => (
                                    <option key={lead.id} value={lead.id}>
                                        {lead.name} ({lead.phone})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Reminder message..."
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                style={{
                                    padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB',
                                    background: '#FAFAFA', fontSize: 14, color: '#111827',
                                    outline: 'none',
                                }}
                            />
                            <input
                                type="datetime-local"
                                value={formData.dueDate}
                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                style={{
                                    padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E7EB',
                                    background: '#FAFAFA', fontSize: 14, color: '#111827',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={handleAddReminder}
                                disabled={createMutation.isPending}
                                style={{
                                    padding: '10px 16px', background: '#2563EB', color: '#fff',
                                    border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                                    fontSize: 14,
                                }}
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setShowAddForm(false)}
                                style={{
                                    padding: '10px 16px', background: '#E5E7EB', color: '#111827',
                                    border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                                    fontSize: 14,
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Pending Reminders */}
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
                        Pending ({pendingReminders.length})
                    </h2>
                    {pendingReminders.length === 0 ? (
                        <div style={{
                            background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
                            padding: 40, textAlign: 'center', color: '#9CA3AF',
                        }}>
                            No pending reminders
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: 12 }}>
                            {pendingReminders.map(reminder => (
                                <div
                                    key={reminder.id}
                                    style={{
                                        background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
                                        padding: 16, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16,
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                            <Clock size={16} color="#F59E0B" />
                                            <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                                                {reminder.leadName}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>{reminder.message}</p>
                                        <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                                            Due: {format(new Date(reminder.dueDate), 'PPp')}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={() => updateMutation.mutate({ id: reminder.id, data: { status: 'done' } })}
                                            title="Mark as done"
                                            style={{
                                                background: '#10B981', color: '#fff', border: 'none',
                                                borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 4,
                                            }}
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteMutation.mutate(reminder.id)}
                                            title="Delete"
                                            style={{
                                                background: '#EF4444', color: '#fff', border: 'none',
                                                borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 4,
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Completed Reminders */}
                {completedReminders.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
                            Completed ({completedReminders.length})
                        </h2>
                        <div style={{ display: 'grid', gap: 12 }}>
                            {completedReminders.map(reminder => (
                                <div
                                    key={reminder.id}
                                    style={{
                                        background: '#fff', borderRadius: 12, border: '1px solid #E5E7EB',
                                        padding: 16, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16,
                                        alignItems: 'center', opacity: 0.7,
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                            <CheckCircle size={16} color="#10B981" />
                                            <span style={{ fontSize: 14, fontWeight: 600, color: '#6B7280' }}>
                                                {reminder.leadName}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 8 }}>{reminder.message}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteMutation.mutate(reminder.id)}
                                        title="Delete"
                                        style={{
                                            background: 'none', border: 'none',
                                            cursor: 'pointer', color: '#EF4444',
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
