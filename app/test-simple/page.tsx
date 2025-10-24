export default function SimpleTest() {
  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#0a0a0a',
        color: 'white',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>🧪 Simple Test Page</h1>
      <p>If you can see this, the basic Next.js setup is working!</p>
      <div
        style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#29E7CD',
          color: 'black',
          borderRadius: '10px',
        }}
      >
        <h2>✅ Success!</h2>
        <p>This page uses inline styles to bypass any CSS loading issues.</p>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Test Links:</h3>
        <ul>
          <li>
            <a href="/" style={{ color: '#29E7CD' }}>
              Main Landing Page
            </a>
          </li>
          <li>
            <a href="/animation-test" style={{ color: '#29E7CD' }}>
              Animation Test Page
            </a>
          </li>
          <li>
            <a href="/webapp" style={{ color: '#29E7CD' }}>
              WebApp Dashboard
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
