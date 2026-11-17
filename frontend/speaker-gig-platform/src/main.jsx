import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '32px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '40px auto', background: '#fff', border: '1px solid #fee2e2', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#b91c1c', marginBottom: '12px' }}>⚠️ Something went wrong in SpeakHub</h2>
          <p style={{ color: '#4b5563', marginBottom: '16px' }}>The following error occurred during rendering:</p>
          <pre style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
          </pre>
          {this.state.error?.stack && (
            <pre style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontSize: '12px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
              {this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}


