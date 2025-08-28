import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleHelp } from 'lucide-react';

import { QueryError } from '@/components/common/query-error';
import type { TaxPayer } from '@/types/tax-payer';
import type { TaxReceipt, TaxReceiptsResponse } from '@/types/tax-receipt';
import { formatRD, getDisplayName, getDocLabelFromTaxPayer } from '@/utils';

type Props = {
  selectedId: number | null;
  selectedRegistry?: TaxPayer | null;
  isLoadingTaxReceipts: boolean;
  isFetchingTaxReceipts?: boolean;
  isErrorTaxReceipts: boolean;
  taxReceipts?: TaxReceiptsResponse;
  taxReceiptsError?: unknown;
  refetchTaxReceipts: () => void;
};

export default function TaxReceiptsPanel({
  selectedId,
  isLoadingTaxReceipts,
  isFetchingTaxReceipts,
  isErrorTaxReceipts,
  taxReceipts,
  taxReceiptsError,
  refetchTaxReceipts,
}: Props) {
  const fetching = isFetchingTaxReceipts;
  const hasData = (taxReceipts?.data?.length ?? 0) > 0;

  const selectedRegistry = taxReceipts?.data.find(
    (taxReceipt) => taxReceipt.id === selectedId
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Comprobantes Fiscales</CardTitle>
          <CardDescription>
            {selectedRegistry
              ? `Comprobantes Fiscales relacionados a ${getDisplayName(
                  selectedRegistry.taxPayer
                )}`
              : ''}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!selectedId ? (
            <div
              role="status"
              aria-live="polite"
              className="text-center py-12 text-muted-foreground"
            >
              <CircleHelp className="h-12 w-12 mx-auto opacity-50 mb-4" />
              <p className="text-sm">
                Seleccione un contribuyente{' '}
                <span className="hidden md:inline">en el panel izquierdo </span>
                para visualizar sus comprobantes fiscales
              </p>
            </div>
          ) : isErrorTaxReceipts ? (
            <QueryError
              error={taxReceiptsError}
              onRetry={refetchTaxReceipts}
              className="my-2"
            />
          ) : isLoadingTaxReceipts || fetching ? (
            <div className="p-1 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </Card>
              ))}
            </div>
          ) : !hasData ? (
            <div className="text-center py-8 text-muted-foreground">
              No related registries found
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {taxReceipts?.data?.map((receipt: TaxReceipt) => {
                const name = getDisplayName(receipt.taxPayer);
                const docLabel = getDocLabelFromTaxPayer(receipt.taxPayer);
                const tipo = receipt.taxPayer.taxPayerType?.description ?? '—';
                const docTipo =
                  receipt.taxPayer.documentType?.description ?? '—';

                return (
                  <Card
                    key={receipt.id}
                    className="hover:bg-accent transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h4 className="font-medium leading-tight truncate">
                            NCF:{' '}
                            <span className="font-mono">{receipt.ncf}</span>
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {docLabel}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">{tipo}</Badge>
                            <Badge variant="outline">{docTipo}</Badge>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-xs text-muted-foreground">
                            Monto
                          </div>
                          <div className="font-semibold">
                            {formatRD(receipt.amount)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            ITBIS
                          </div>
                          <div className="font-bold text-primary">
                            {formatRD(receipt.itbis)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>

        {Boolean(selectedId) &&
          !isLoadingTaxReceipts &&
          !fetching &&
          !isErrorTaxReceipts &&
          hasData && (
            <CardFooter className="flex justify-end">
              <span className="px-3 py-1 rounded-md bg-muted font-semibold text-primary">
                {`Total ITBIS: ${formatRD(
                  taxReceipts!.data!.reduce(
                    (sum, it) => sum + (it.itbis ?? 0),
                    0
                  )
                )}`}
              </span>
            </CardFooter>
          )}
      </Card>
    </div>
  );
}
