import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in 1929 Game:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch (e) {
      console.error('Error clearing cache:', e);
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-noir-950 text-paper-100 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md w-full bg-noir-900 border-2 border-gold-500/50 rounded-lg p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-gold-400 uppercase font-bold">
                Santa Augusta • Relatório de Ocorrência
              </span>
              <h2 className="font-display text-2xl font-bold text-paper-100 mt-1">
                Contratempo nos Bastidores
              </h2>
              <p className="text-xs text-noir-400 font-serif italic mt-1">
                Ocorreu uma falha no carregamento dos dados da cidade.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-noir-950 rounded border border-noir-800 text-[11px] font-mono text-red-300 text-left overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center py-2.5 px-4 rounded bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-noir-950 font-serif-vintage font-bold text-xs uppercase tracking-wider shadow-gold-subtle hover:brightness-110 active:scale-95 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Recarregar
              </button>

              <button
                onClick={this.handleClearStorage}
                className="flex-1 inline-flex items-center justify-center py-2.5 px-4 rounded bg-noir-800 text-paper-200 border border-noir-700 font-serif-vintage font-semibold text-xs uppercase tracking-wider hover:bg-noir-750 active:scale-95 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5 text-red-400" />
                Limpar Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
