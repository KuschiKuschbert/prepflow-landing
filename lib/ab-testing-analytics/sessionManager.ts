export function getSessionId(): string {
  if (typeof window !== 'undefined') {
    return (
      sessionStorage.getItem('prepflow_session_id') ||
      'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }
  return 'server_session_' + Date.now();
}
