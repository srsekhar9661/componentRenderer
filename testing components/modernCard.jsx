import React, { useState } from 'react';

const ModernCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cardStyle = {
    maxWidth: '400px',
    margin: '2rem auto',
    background: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    padding: '2rem',
    color: 'white',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem'
  };

  const avatarStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginRight: '1rem'
  };

  const buttonStyle = {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '25px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem'
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-5px)';
        e.target.style.boxShadow = '0 25px 50px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
      }}
    >
      <div style={headerStyle}>
        <div style={avatarStyle}>👤</div>
        <div>
          <h3 style={{margin: 0, fontSize: '1.5rem'}}>John Doe</h3>
          <p style={{margin: '0.25rem 0 0 0', opacity: 0.8}}>Frontend Developer</p>
        </div>
      </div>
      
      <p style={{lineHeight: '1.6', opacity: 0.9}}>
        {isExpanded 
          ? "I'm passionate about creating beautiful, interactive user experiences. I love working with React, JavaScript, and modern web technologies to build amazing applications that users love."
          : "I'm passionate about creating beautiful, interactive user experiences..."
        }
      </p>
      
      <button 
        style={buttonStyle}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
      >
        {isExpanded ? 'Show Less' : 'Read More'}
      </button>
    </div>
  );
};

export default ModernCard;