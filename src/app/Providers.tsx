'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Cache results for 10 min — instant tab switching, no refetch on focus
                staleTime: 10 * 60 * 1000,
                // Keep in cache for 15 min after component unmounts
                gcTime: 15 * 60 * 1000,
                // Only retry once on network failure with exponential backoff
                retry: (failureCount) => failureCount < 2,
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                // Don't refetch when window regains focus (avoids flicker)
                refetchOnWindowFocus: false,
                // Don't refetch on mount if data already cached and fresh
                refetchOnMount: false,
                // No background refetching during reconnect
                refetchOnReconnect: false,
                // Smaller network waterfall
                networkMode: 'online' as const,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryClientProvider>
    );
}
