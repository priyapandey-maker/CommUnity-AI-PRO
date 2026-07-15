import { Component, ErrorInfo, ReactNode } from 'react';
import { Card, PrimaryButton, SecondaryButton } from '@/components';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
          <Card variant="glass" padding="lg" className="max-w-md w-full text-center border-red-500/20 bg-red-500/5">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-primary mb-3">Something went wrong</h1>
            <p className="text-secondary mb-8 leading-relaxed">
              We've encountered an unexpected error. Our team has been notified. 
              You can try again or return to the safety of the homepage.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <PrimaryButton onClick={this.handleRetry} className="w-full sm:w-auto">
                Try Again
              </PrimaryButton>
              <SecondaryButton onClick={this.handleGoHome} className="w-full sm:w-auto">
                Return Home
              </SecondaryButton>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
