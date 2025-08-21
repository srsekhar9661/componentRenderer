import React, { useState } from 'react';

const DashboardWidget = () => {
  const [stats, setStats] = useState({ users: 1250, revenue: 15650, growth: 12.5 });
  const [isAnimating, setIsAnimating] = useState(false);

  const containerStyle = {
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    borderRadius: '15px',
    padding: '2rem',
    color: 'white',
    maxWidth: '500px',
    margin: '2rem auto',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    marginTop: '2rem'
  };

  const statCardStyle = {
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '1.5rem',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)'
  };

  const buttonStyle = {
    background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '25px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '2rem'
  };

  const refreshData = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStats({
        users: Math.floor(Math.random() * 5000) + 1000,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        growth: (Math.random() * 30 + 5).toFixed(1)
      });
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div style={containerStyle}>
      <div style={{textAlign: 'center', marginBottom: '1rem'}}>
        <h2 style={{margin: 0, fontSize: '2rem', marginBottom: '0.5rem'}}>📊 Analytics Dashboard</h2>
        <p style={{margin: 0, opacity: 0.8}}>Real-time business metrics</p>
      </div>

      <div style={gridStyle}>
        <div 
          style={statCardStyle}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>👥</div>
          <div style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#4ade80'}}>
            {isAnimating ? '...' : stats.users.toLocaleString()}
          </div>
          <div style={{fontSize: '0.9rem', opacity: 0.8}}>Active Users</div>
        </div>

        <div 
          style={statCardStyle}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>💰</div>
          <div style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#60a5fa'}}>
            {isAnimating ? '...' : `${stats.revenue.toLocaleString()}`}
          </div>
          <div style={{fontSize: '0.9rem', opacity: 0.8}}>Revenue</div>
        </div>

        <div 
          style={statCardStyle}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <div style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>📈</div>
          <div style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#f59e0b'}}>
            {isAnimating ? '...' : `+${stats.growth}%`}
          </div>
          <div style={{fontSize: '0.9rem', opacity: 0.8}}>Growth</div>
        </div>
      </div>

      <div style={{textAlign: 'center'}}>
        <button 
          style={buttonStyle}
          onClick={refreshData}
          disabled={isAnimating}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          {isAnimating ? '🔄 Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default DashboardWidget;