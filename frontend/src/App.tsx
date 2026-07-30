import { useEffect, useState } from 'react';

// Define a TypeScript interface for our API response
interface Greeting {
  message: string;
}

function App() {
  const [greeting, setGreeting] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // We use the relative path. The Vite or Nginx proxy handles the rest!
    fetch('/api/greeting')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: Greeting) => {
        setGreeting(data.message);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch greeting:', err);
        setError('Could not connect to the backend API.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif',
      backgroundColor: '#f3f4f6',
      color: '#1f2937'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h1>Full-Stack Setup Check</h1>
        
        {loading && <p>Connecting to backend...</p>}
        
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}
        
        {!loading && !error && (
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            API Response: <span style={{ color: '#3b82f6' }}>{greeting}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;