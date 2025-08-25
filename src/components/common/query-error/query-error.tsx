import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type QueryErrorProps = {
  title?: string;
  message?: string;
  error?: unknown;
  onRetry?: () => void;
  className?: string;
};

export default function QueryError({
  title = 'No pudimos cargar los datos',
  message = 'Ocurrió un error al consultar el servicio. Inténtalo de nuevo.',
  onRetry,
  className,
}: QueryErrorProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'rounded-md border p-4 bg-destructive/10 text-destructive',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium">{title}</p>
          <p className="text-sm opacity-90">{message}</p>
        </div>

        {onRetry && (
          <Button
            variant="destructive"
            size="sm"
            className="shrink-0"
            onClick={onRetry}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reintentar
          </Button>
        )}
      </div>
    </div>
  );
}
