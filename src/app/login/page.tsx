'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthProvider';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Login failed';
            setError(msg.includes('user-not-found') || msg.includes('wrong-password')
                ? 'Invalid email or password.'
                : 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 50%, #FDF2F8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
        }}>
            {/* Decorative background circles */}
            <div style={{
                position: 'fixed', top: -100, right: -100, width: 400, height: 400,
                borderRadius: '50%', background: 'rgba(37,99,235,0.06)', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'fixed', bottom: -120, left: -80, width: 350, height: 350,
                borderRadius: '50%', background: 'rgba(99,102,241,0.06)', pointerEvents: 'none',
            }} />

            <div style={{
                width: '100%', maxWidth: 420,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(12px)',
                borderRadius: 20,
                border: '1px solid rgba(229,231,235,0.8)',
                padding: 40,
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                animation: 'fadeIn 0.4s ease-out',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 16,
                        background: 'linear-gradient(135deg, #2563EB, #6366F1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                        boxShadow: '0 8px 20px rgba(37,99,235,0.3)',
                    }}>
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: 24 }}>G</span>
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>Gharpayy CRM</h1>
                    <p style={{ fontSize: 14, color: '#6B7280', marginTop: 6 }}>Sign in to your workspace</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Email */}
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
                            Email address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="agent@gharpayy.com"
                            required
                            style={{
                                width: '100%', height: 44, borderRadius: 10,
                                border: '1.5px solid #E5E7EB', padding: '0 14px',
                                fontSize: 14, color: '#111827', outline: 'none',
                                transition: 'border-color 0.15s',
                                background: '#FAFAFA',
                            }}
                            onFocus={e => (e.target.style.borderColor = '#2563EB')}
                            onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                style={{
                                    width: '100%', height: 44, borderRadius: 10,
                                    border: '1.5px solid #E5E7EB', padding: '0 44px 0 14px',
                                    fontSize: 14, color: '#111827', outline: 'none',
                                    transition: 'border-color 0.15s', background: '#FAFAFA',
                                }}
                                onFocus={e => (e.target.style.borderColor = '#2563EB')}
                                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                style={{
                                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF',
                                    display: 'flex', alignItems: 'center',
                                }}
                            >
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            background: '#FEF2F2', border: '1px solid #FECACA',
                            borderRadius: 8, padding: '10px 14px',
                            color: '#DC2626', fontSize: 13,
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            height: 44, borderRadius: 10, border: 'none',
                            background: loading ? '#93C5FD' : 'linear-gradient(135deg, #2563EB, #4F46E5)',
                            color: '#fff', fontWeight: 600, fontSize: 14,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            transition: 'opacity 0.15s, transform 0.15s',
                            boxShadow: loading ? 'none' : '0 4px 12px rgba(37,99,235,0.3)',
                        }}
                        onMouseEnter={e => { if (!loading) (e.currentTarget.style.transform = 'translateY(-1px)'); }}
                        onMouseLeave={e => { (e.currentTarget.style.transform = 'translateY(0)'); }}
                    >
                        {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginTop: 24 }}>
                    Access is restricted to authorized team members only.
                </p>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
