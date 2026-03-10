'use client';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, updateLead } from '@/lib/firestore/leads';
import { Lead, STAGE_COLORS, PIPELINE_STAGES, LeadStage } from '@/types';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Phone, User } from 'lucide-react';
import Link from 'next/link';

export default function PipelinePage() {
    const qc = useQueryClient();
    const { data: rawLeads = [] } = useQuery({
        queryKey: ['leads'],
        queryFn: () => getLeads(),
    });

    // Optimistic updates state
    const [optimisticUpdates, setOptimisticUpdates] = useState<Record<string, LeadStage>>({});

    // Merge Firebase data with optimistic updates
    const leadsList = useMemo(() => {
        return rawLeads.map(lead => ({
            ...lead,
            stage: optimisticUpdates[lead.id] || lead.stage,
        }));
    }, [rawLeads, optimisticUpdates]);

    const moveMutation = useMutation({
        mutationFn: ({ id, stage }: { id: string; stage: LeadStage }) => updateLead(id, { stage }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
    });

    const getStageLeads = (stage: LeadStage) => leadsList.filter(l => l.stage === stage);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const { draggableId, destination } = result;
        const newStage = destination.droppableId as LeadStage;
        const lead = leadsList.find(l => l.id === draggableId);
        if (!lead || lead.stage === newStage) return;
        // Optimistic update
        setOptimisticUpdates(prev => ({ ...prev, [draggableId]: newStage }));
        // Update Firebase (will refresh automatically)
        moveMutation.mutate(
            { id: draggableId, stage: newStage },
            {
                onSuccess: () => {
                    // Clear optimistic update on success
                    setOptimisticUpdates(prev => {
                        const updated = { ...prev };
                        delete updated[draggableId];
                        return updated;
                    });
                },
                onError: () => {
                    // Revert optimistic update on error
                    setOptimisticUpdates(prev => {
                        const updated = { ...prev };
                        delete updated[draggableId];
                        return updated;
                    });
                },
            }
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Stage summary pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {PIPELINE_STAGES.map(stage => {
                    const count = getStageLeads(stage).length;
                    const sc = STAGE_COLORS[stage];
                    return (
                        <div key={stage} style={{
                            display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600,
                            padding: '3px 10px', borderRadius: 999,
                            background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                        }}>
                            {stage}: <strong>{count}</strong>
                        </div>
                    );
                })}
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{
                    display: 'flex', gap: 10, overflowX: 'auto',
                    paddingBottom: 16, alignItems: 'flex-start',
                    minHeight: 'calc(100vh - 200px)',
                }}>
                    {PIPELINE_STAGES.map(stage => {
                        const stageLeads = getStageLeads(stage);
                        const sc = STAGE_COLORS[stage];
                        return (
                            <div key={stage} style={{ flexShrink: 0, width: 230, display: 'flex', flexDirection: 'column' }}>
                                {/* Column header */}
                                <div style={{
                                    background: sc.bg, border: `1px solid ${sc.border}`,
                                    borderRadius: '12px 12px 0 0', padding: '10px 12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: sc.text }}>{stage}</span>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, minWidth: 20, height: 20,
                                        borderRadius: '50%', background: sc.text, color: '#fff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>{stageLeads.length}</span>
                                </div>
                                {/* Droppable */}
                                <Droppable droppableId={stage}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{
                                                minHeight: 180, padding: 8,
                                                background: snapshot.isDraggingOver ? '#F0F4FF' : '#F9FAFB',
                                                borderLeft: `1px solid ${snapshot.isDraggingOver ? '#BFDBFE' : '#E5E7EB'}`,
                                                borderRight: `1px solid ${snapshot.isDraggingOver ? '#BFDBFE' : '#E5E7EB'}`,
                                                borderBottom: `1px solid ${snapshot.isDraggingOver ? '#BFDBFE' : '#E5E7EB'}`,
                                                borderRadius: '0 0 12px 12px',
                                                transition: 'background 0.15s',
                                            }}
                                        >
                                            {stageLeads.map((lead, idx) => (
                                                <Draggable key={lead.id} draggableId={lead.id} index={idx}>
                                                    {(prov, snap) => (
                                                        <div
                                                            ref={prov.innerRef}
                                                            {...prov.draggableProps}
                                                            {...prov.dragHandleProps}
                                                            style={{
                                                                ...prov.draggableProps.style,
                                                                background: '#fff', borderRadius: 10,
                                                                border: `1px solid ${snap.isDragging ? '#BFDBFE' : '#E5E7EB'}`,
                                                                padding: 10, marginBottom: 8,
                                                                boxShadow: snap.isDragging ? '0 8px 24px rgba(37,99,235,0.18)' : '0 1px 3px rgba(0,0,0,0.04)',
                                                                cursor: 'grab',
                                                            }}
                                                        >
                                                            <Link href={`/leads/${lead.id}`} style={{ textDecoration: 'none' }}>
                                                                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 5, lineHeight: 1.3 }}>{lead.name}</div>
                                                            </Link>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6B7280', marginBottom: 4 }}>
                                                                <Phone size={9} color="#9CA3AF" /> {lead.phone}
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6B7280', marginBottom: 7 }}>
                                                                <User size={9} color="#9CA3AF" /> {lead.assignedAgentName || 'Unassigned'}
                                                            </div>
                                                            <div style={{
                                                                fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 999,
                                                                background: sc.bg, color: sc.text, display: 'inline-block',
                                                            }}>{lead.source}</div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            {stageLeads.length === 0 && (
                                                <div style={{
                                                    textAlign: 'center', padding: '20px 8px',
                                                    fontSize: 11, color: '#D1D5DB',
                                                    border: '1.5px dashed #E5E7EB', borderRadius: 8,
                                                }}>Drop leads here</div>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
}
