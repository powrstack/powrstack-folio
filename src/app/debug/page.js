export default function DebugPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Page</h1>
      <p>Environment: {process.env.NODE_ENV}</p>
      <p>Runtime: {process.env.NEXT_RUNTIME || 'Not set'}</p>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>User Agent: {typeof navigator !== 'undefined' ? navigator.userAgent : 'Server-side'}</p>
    </div>
  );
}
