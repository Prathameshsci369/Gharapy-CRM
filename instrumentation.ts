// Performance monitoring instrumentation for Next.js
// This helps track build-time performance issues

export async function register() {
  // Instrumentation for Next.js 
  // This is optional - used for performance monitoring
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation - optional
  }
  
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation - optional
  }
}
