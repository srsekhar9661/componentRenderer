import React, { useState, useRef } from 'react';
import { Upload, Play, AlertCircle, Code, Eye, Download, Copy } from 'lucide-react';

const JSXUploader = () => {
  const [uploadedCode, setUploadedCode] = useState('');
  const [renderedComponent, setRenderedComponent] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const fileInputRef = useRef(null);

  // Default sample component for demonstration
  const sampleComponent = `import React, { useState } from 'react';

const SampleComponent = () => {
  const [count, setCount] = useState(0);
  
  const containerStyle = {
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '1rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    maxWidth: '400px',
    margin: '0 auto',
    textAlign: 'center'
  };
  
  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    margin: '0 0.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    fontSize: '1rem'
  };
  
  return (
    <div style={containerStyle}>
      <h2 style={{fontSize: '2rem', marginBottom: '1rem'}}>Interactive Counter</h2>
      <p style={{fontSize: '3rem', fontWeight: 'bold', margin: '1.5rem 0', color: '#ffeb3b'}}>
        {count}
      </p>
      <div>
        <button 
          onClick={() => setCount(count - 1)}
          style={{...buttonStyle, background: '#f44336', color: 'white'}}
        >
          Decrease
        </button>
        <button 
          onClick={() => setCount(0)}
          style={{...buttonStyle, background: '#9e9e9e', color: 'white'}}
        >
          Reset
        </button>
        <button 
          onClick={() => setCount(count + 1)}
          style={{...buttonStyle, background: '#4caf50', color: 'white'}}
        >
          Increase
        </button>
      </div>
    </div>
  );
};

export default SampleComponent;`;

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setUploadedCode(content);
        setError('');
        setRenderedComponent(null);
      };
      reader.readAsText(file);
    }
  };

 

  const renderComponent = async () => {
    if (!uploadedCode.trim()) {
      setError('Please upload a JSX file or load the sample first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let transformedCode = uploadedCode;
      
      // Remove import statements and extract what's being imported
      const importMatches = transformedCode.match(/import\s+.*?from\s+['"]react['"];?\n?/g);
      transformedCode = transformedCode.replace(/import.*?from.*?;?\n?/g, '');
      
      // Remove export default and extract component name
      const componentMatch = transformedCode.match(/const\s+(\w+)\s*=/);
      const componentName = componentMatch ? componentMatch[1] : 'Component';
      
      transformedCode = transformedCode.replace(/export\s+default\s+\w+;?/, '');
      
      // Create a function that returns the component with proper React context
      const componentCode = `
        const { useState, useEffect, useRef, useCallback, useMemo } = React;
        ${transformedCode}
        return ${componentName};
      `;

      // Create and execute the component function
      const ComponentFunction = new Function('React', componentCode);
      const Component = ComponentFunction(React);
      
      setRenderedComponent(React.createElement(Component));//setRenderedComponent(<Component />);
    } catch (err) {
      setError(`Error rendering component: ${err.message}`);
      console.error('Component rendering error:', err);
    }

    setIsLoading(false);
  };

  const openInNewPage = () => {
    if (!uploadedCode.trim()) {
      setError('Please upload a JSX file or load the sample first');
      return;
    }

    try {
      let transformedCode = uploadedCode;
      
      // Remove import statements
      transformedCode = transformedCode.replace(/import.*?from.*?;?\n?/g, '');
      
      // Extract component name
      const componentMatch = transformedCode.match(/const\s+(\w+)\s*=/);
      const componentName = componentMatch ? componentMatch[1] : 'Component';
      
      transformedCode = transformedCode.replace(/export\s+default\s+\w+;?/, '');

      // Create a complete HTML page
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Component Preview</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #root {
            width: 100%;
            max-width: 1200px;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 2rem;
        }
        .header h1 {
            font-size: 2rem;
            margin: 0 0 0.5rem 0;
        }
        .header p {
            opacity: 0.8;
            margin: 0;
        }
    </style>
</head>
<body>
    <div id="root">
        <div class="header">
            <h1>🚀 React Component Preview</h1>
            <p>Live component rendered from JSX uploader</p>
        </div>
        <div id="component-container"></div>
    </div>

    <script type="text/babel">
        const { useState, useEffect, useRef, useCallback, useMemo } = React;
        
        ${transformedCode}

        // Render the component
        const container = document.getElementById('component-container');
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(${componentName}));
    </script>
</body>
</html>`;

      // Open in new window
      const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
      newWindow.document.write(htmlContent);
      newWindow.document.close();
      
    } catch (err) {
      setError(`Error opening component: ${err.message}`);
      console.error('Error opening component:', err);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(uploadedCode);
  };

  const downloadCode = () => {
    const blob = new Blob([uploadedCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component.jsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a0933 50%, #0f0f23 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      maxWidth: '1200px',
      margin: '0 auto 3rem auto'
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, #60a5fa, #a78bfa, #f472b6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '1.5rem',
      textAlign: 'center'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#d1d5db',
      maxWidth: '768px',
      margin: '0 auto',
      lineHeight: '1.6',
      textAlign: 'center'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '2rem',
      maxWidth: '1400px',
      margin: '0 auto'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '2rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center'
    },
    iconContainer: {
      width: '2rem',
      height: '2rem',
      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '0.75rem'
    },
    uploadArea: {
      border: '2px dashed #a78bfa',
      borderRadius: '1rem',
      padding: '3rem',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      background: 'rgba(255, 255, 255, 0.05)',
      marginBottom: '1.5rem'
    },
    uploadAreaHover: {
      borderColor: '#c084fc',
      background: 'rgba(255, 255, 255, 0.1)'
    },
    button: {
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    primaryButton: {
      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
      color: 'white',
      width: '100%',
      marginBottom: '1rem'
    },
    secondaryButton: {
      background: 'linear-gradient(45deg, #10b981, #059669)',
      color: 'white',
      width: '100%'
    },
    renderButton: {
      background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
      color: 'white',
      width: '100%',
      padding: '1rem',
      fontSize: '1.1rem',
      marginTop: '1.5rem'
    },
    disabledButton: {
      background: '#6b7280',
      cursor: 'not-allowed'
    },
    codeContainer: {
      background: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      marginTop: '1rem'
    },
    codeHeader: {
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '0.75rem 1rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center'
    },
    codeContent: {
      padding: '1.5rem',
      overflow: 'auto',
      maxHeight: '300px',
      fontSize: '0.9rem',
      color: '#e5e7eb',
      fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      lineHeight: '1.5'
    },
    previewArea: {
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '1rem',
      minHeight: '400px',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    errorMessage: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '0.75rem',
      padding: '1rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      color: '#fca5a5'
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap'
    },
    smallButton: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    emptyState: {
      textAlign: 'center',
      color: '#9ca3af',
      padding: '2rem'
    },
    emptyIcon: {
      width: '4rem',
      height: '4rem',
      margin: '0 auto 1rem auto',
      background: 'linear-gradient(45deg, #6b7280, #4b5563)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    divider: {
      position: 'relative',
      textAlign: 'center',
      margin: '1.5rem 0'
    },
    dividerLine: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      height: '1px',
      background: '#6b7280'
    },
    dividerText: {
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a0933 50%, #0f0f23 100%)',
      padding: '0 1rem',
      color: '#9ca3af',
      fontSize: '0.875rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          JSX Component Playground
        </h1>
        <p style={styles.subtitle}>
          Upload, preview, and demo React components instantly. Transform your Claude-generated 
          JSX into live, interactive previews with our beautiful component playground.
        </p>
      </div>

      <div style={styles.grid}>
        {/* Upload and Code Section */}
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <div style={{...styles.iconContainer, background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)'}}>
                <Upload size={16} color="white" />
              </div>
              Upload JSX File
            </h2>
            
            <div 
              style={styles.uploadArea}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#c084fc';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#a78bfa';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jsx,.js,.tsx,.ts"
                onChange={handleFileUpload}
                style={{display: 'none'}}
              />
              <div style={{...styles.iconContainer, width: '4rem', height: '4rem', margin: '0 auto 1rem auto'}}>
                <Upload size={24} color="white" />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{...styles.button, ...styles.primaryButton, width: 'auto', margin: '0 auto'}}
              >
                Choose JSX File
              </button>
              <p style={{marginTop: '1rem', color: '#d1d5db', fontSize: '0.9rem'}}>
                Or drag and drop a .jsx, .js, .tsx, or .ts file
              </p>
            </div>

          </div>

          {uploadedCode && (
            <div style={{...styles.card, marginTop: '2rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <h3 style={{...styles.cardTitle, marginBottom: 0}}>
                  <div style={{...styles.iconContainer, background: 'linear-gradient(45deg, #10b981, #059669)'}}>
                    <Code size={16} color="white" />
                  </div>
                  Component Code
                </h3>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => setShowCode(!showCode)}
                    style={styles.smallButton}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                  >
                    {showCode ? 'Hide' : 'Show'} Code
                  </button>
                  <button
                    onClick={copyCode}
                    style={{...styles.smallButton, background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd'}}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.3)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.2)'}
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={downloadCode}
                    style={{...styles.smallButton, background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7'}}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(16, 185, 129, 0.3)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(16, 185, 129, 0.2)'}
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
              
              {showCode && (
                <div style={styles.codeContainer}>
                  <div style={styles.codeHeader}>
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                      <div style={{width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%'}}></div>
                      <div style={{width: '12px', height: '12px', background: '#eab308', borderRadius: '50%'}}></div>
                      <div style={{width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%'}}></div>
                      <span style={{marginLeft: '1rem', color: '#9ca3af', fontSize: '0.8rem'}}>component.jsx</span>
                    </div>
                  </div>
                  <pre style={styles.codeContent}>
                    {uploadedCode}
                  </pre>
                </div>
              )}

              <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                <button
                  onClick={renderComponent}
                //   disabled={isLoading}
                disabled={true}
                  style={{
                    ...styles.button, 
                    ...styles.renderButton,
                    ...(isLoading ? styles.disabledButton : {}),
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {isLoading ? (
                    <>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '0.75rem'
                      }}></div>
                      Rendering...
                    </>
                  ) : (
                    <>
                      <Eye size={20} style={{marginRight: '0.75rem'}} />
                      Preview Here
                    </>
                  )}
                </button>

                <button
                  onClick={openInNewPage}
                  disabled={isLoading}
                  style={{
                    ...styles.button,
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    color: 'white',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    flex: 1,
                    ...(isLoading ? styles.disabledButton : {})
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <Play size={20} style={{marginRight: '0.75rem'}} />
                  Open in New Page
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <div style={{...styles.iconContainer, background: 'linear-gradient(45deg, #ec4899, #be185d)'}}>
                <Eye size={16} color="white" />
              </div>
              Live Preview
            </h2>

            {error && (
              <div style={styles.errorMessage}>
                <AlertCircle size={20} style={{marginRight: '0.75rem', flexShrink: 0}} />
                <span>{error}</span>
              </div>
            )}

            <div style={styles.previewArea}>
              {renderedComponent ? (
                <div style={{width: '100%'}}>
                  {renderedComponent}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <Eye size={32} color="#9ca3af" />
                  </div>
                  <p style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem'}}>Component Preview</p>
                  <p style={{fontSize: '0.9rem'}}>Upload a JSX file and click "Render Component" to see it live</p>
                </div>
              )}
            </div>
          </div>

          <div style={{...styles.card, marginTop: '2rem'}}>
            <h3 style={{...styles.cardTitle, fontSize: '1.25rem'}}>
              <div style={{...styles.iconContainer, background: 'linear-gradient(45deg, #6366f1, #8b5cf6)'}}>
                <AlertCircle size={16} color="white" />
              </div>
              Usage Guide
            </h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
              <div style={{background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.75rem'}}>
                  <div style={{width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', marginRight: '0.75rem'}}></div>
                  <span style={{color: '#6ee7b7', fontWeight: '600'}}>Supported</span>
                </div>
                <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#d1d5db'}}>
                  <li style={{marginBottom: '0.5rem'}}>• React functional components</li>
                  <li style={{marginBottom: '0.5rem'}}>• useState and useEffect hooks</li>
                  <li style={{marginBottom: '0.5rem'}}>• Inline styles</li>
                  <li style={{marginBottom: '0.5rem'}}>• Standard JSX syntax</li>
                  <li>• Claude-generated components</li>
                </ul>
              </div>
              <div style={{background: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.75rem', padding: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '0.75rem'}}>
                  <div style={{width: '8px', height: '8px', background: '#eab308', borderRadius: '50%', marginRight: '0.75rem'}}></div>
                  <span style={{color: '#fde047', fontWeight: '600'}}>Limitations</span>
                </div>
                <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#d1d5db'}}>
                  <li style={{marginBottom: '0.5rem'}}>• External library imports</li>
                  <li style={{marginBottom: '0.5rem'}}>• Complex TypeScript types</li>
                  <li style={{marginBottom: '0.5rem'}}>• Node.js specific modules</li>
                  <li style={{marginBottom: '0.5rem'}}>• Server-side rendering</li>
                  <li>• CSS framework dependencies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default JSXUploader;