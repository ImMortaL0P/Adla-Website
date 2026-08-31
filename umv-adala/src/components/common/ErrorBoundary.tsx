import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

/**
 * Catches rendering errors in its children and shows a friendly fallback UI.
 * Does NOT show stack traces to users.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real app, this would log to a service like Sentry
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-[hsl(var(--destructive))/20] bg-[hsl(var(--destructive))/5] p-8 text-center my-8">
          <AlertTriangle className="mb-4 h-10 w-10 text-[hsl(var(--destructive))]" />
          <h3 className="mb-2 text-lg font-semibold text-[hsl(var(--foreground))]">
            Something went wrong loading this section
          </h3>
          <p className="mb-6 text-sm text-[hsl(var(--muted-foreground))]">
            We've encountered an unexpected error.
          </p>
          <button
            onClick={this.handleReset}
            className="rounded-lg bg-[hsl(var(--background))] border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium hover:bg-[hsl(var(--muted))] transition-colors"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
