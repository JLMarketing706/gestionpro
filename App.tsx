import React, { useState, useEffect } from 'react';

// Simple loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    height: '100vh', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      <p>Iniciando Gestión Pro...</p>
    </div>
  </div>
);

// Simple auth form
const AuthForm = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ id: '1', email, name: 'Usuario Demo' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>
            📊 Gestión Pro
          </h1>
          <p style={{ color: '#666' }}>Sistema de gestión profesional</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              background: '#3b82f6',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Iniciar sesión
          </button>
        </form>
        
        <button
          onClick={() => onLogin({ id: 'google', email: 'usuario@gmail.com', name: 'Usuario Google' })}
          style={{
            width: '100%',
            background: '#dc2626',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔍 Continuar con Google (Demo)
        </button>
      </div>
    </div>
  );
};

// Simple dashboard
const Dashboard = ({ user, onLogout }: { user: any; onLogout: () => void }) => (
  <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
    <nav style={{
      background: 'white',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2c3e50', margin: 0 }}>
        📊 Gestión Pro
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: '#666' }}>Bienvenido, {user.name}</span>
        <button
          onClick={onLogout}
          style={{
            background: '#dc2626',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
    
    <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {[
          { title: 'Ventas del mes', value: '$125,430', icon: '💰', color: '#3b82f6' },
          { title: 'Clientes', value: '1,247', icon: '👥', color: '#10b981' },
          { title: 'Productos', value: '856', icon: '📦', color: '#f59e0b' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{stat.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color, marginBottom: '5px' }}>
              {stat.value}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>{stat.title}</div>
          </div>
        ))}
      </div>
      
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Funcionalidades principales</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {[
            { name: 'Ventas', icon: '🧾' },
            { name: 'Clientes', icon: '👤' },
            { name: 'Inventario', icon: '📊' },
            { name: 'Reportes', icon: '📈' }
          ].map((item, index) => (
            <button key={index} style={{
              background: '#f8f9fa',
              border: '1px solid #e9ecef',
              padding: '20px',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'background-color 0.3s'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
              <div style={{ fontWeight: '500' }}>{item.name}</div>
            </button>
          ))}
        </div>
      </div>
    </main>
  </div>
);

// Main App component
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {isLoggedIn && user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
