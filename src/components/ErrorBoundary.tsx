import { Component, ReactNode } from 'react'

interface State { error: Error | null }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#0C0C0C',
            color: '#D7E2EA',
            padding: '4rem 2rem',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
          }}
        >
          <h1 style={{ color: '#B600A8', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Render error
          </h1>
          <p style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '1rem' }}>
            {this.state.error.message}
          </p>
          <pre style={{ fontSize: '0.75rem', color: '#888', overflow: 'auto' }}>
            {this.state.error.stack}
          </pre>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              background: '#B600A8',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
