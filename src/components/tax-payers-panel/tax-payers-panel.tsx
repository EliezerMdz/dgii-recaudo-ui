import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { QueryError } from '@/components/common/query-error';
import TaxPayersPanelFilters from '@/components/tax-payers-panel/tax-payer-filters';
import {
  type TaxPayer,
  type TaxPayerTypeId,
  type TaxPayersResponse,
} from '@/types/tax-payer';
import { getDisplayName, getDocLabel, getStatus } from '@/utils';

type Props = {
  selectedId: number | null;
  setSelectedId: (id: number | null | 0) => void;
  taxPayerTypeId: TaxPayerTypeId | null;
  setTaxPayerTypeId: React.Dispatch<
    React.SetStateAction<TaxPayerTypeId | null>
  >;
  taxPayers?: TaxPayersResponse;
  isLoadingTaxPayers: boolean;
  isErrorTaxPayer: boolean;
  taxPayersError?: unknown;
  refetchTaxPayers: () => void;
};

export default function TaxPayersPanel({
  selectedId,
  setSelectedId,
  taxPayerTypeId,
  setTaxPayerTypeId,
  taxPayers,
  isLoadingTaxPayers,
  isErrorTaxPayer,
  taxPayersError,
  refetchTaxPayers,
}: Props) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {Boolean(selectedId) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedId(0)}
                className="p-1 h-auto"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            Contribuyentes
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <TaxPayersPanelFilters
            taxPayerTypeId={taxPayerTypeId}
            setTaxPayerTypeId={setTaxPayerTypeId}
            setSelectedId={setSelectedId}
          />
          <div className="p-1 space-y-2 max-h-96 overflow-y-auto">
            {isErrorTaxPayer ? (
              <QueryError
                error={taxPayersError}
                onRetry={refetchTaxPayers}
                className="my-2"
              />
            ) : isLoadingTaxPayers ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </Card>
              ))
            ) : (taxPayers?.data?.length ?? 0) === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No se encontraron registros
              </div>
            ) : (
              taxPayers?.data?.map((taxPayer: TaxPayer) => {
                const name = getDisplayName(taxPayer);
                const doc = getDocLabel(taxPayer);
                const tipo = taxPayer?.taxPayerType?.description ?? '—';
                const estado = getStatus(taxPayer);

                return (
                  <Card
                    key={taxPayer.id}
                    className={`cursor-pointer transition-colors hover:bg-accent/60 ${
                      selectedId === taxPayer.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedId(taxPayer.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium leading-tight truncate">
                            {name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {doc}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="secondary">{tipo}</Badge>
                            <Badge
                              variant={
                                estado === 'Activo' ? 'outline' : 'destructive'
                              }
                            >
                              {estado}
                            </Badge>
                          </div>
                        </div>

                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
