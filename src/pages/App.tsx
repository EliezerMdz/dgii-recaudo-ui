import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ChevronRight, ArrowLeft, CircleHelp } from 'lucide-react';
import type { TaxPayer } from '@/types/tax-payer';
import { useTaxPayer, useTaxReceipts } from '@/services/queries/tax-payer';

const isNaturalPerson = (r: TaxPayer) => r?.taxPayerType.code === 'PER';

const getDisplayName = (r: TaxPayer) => {
  if (isNaturalPerson(r)) {
    return [
      r.naturalPerson?.firstName,
      r.naturalPerson?.middleName,
      r.naturalPerson?.firstLastName,
      r.naturalPerson?.secondLastName,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
  }
  return r.legalEntity?.name ?? '—';
};

const getDocLabel = (r: TaxPayer) => {
  const docDesc = r?.documentType.description ?? 'Documento';
  const docNum =
    r?.documentNumber ??
    r?.naturalPerson?.documentNumber ??
    r?.legalEntity?.rnc ??
    '—';
  return `${docDesc}: ${docNum}`;
};

const getStatus = (r: TaxPayer) => (r.isActive ? 'Activo' : 'Inactivo');

const formatRD = (n: number) =>
  n.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' });

const getDocLabelFromTaxPayer = (taxPayer: TaxPayer) => {
  const desc = taxPayer?.documentType.description ?? 'Documento';
  const num =
    taxPayer?.documentNumber ??
    taxPayer?.naturalPerson?.documentNumber ??
    taxPayer?.legalEntity?.rnc ??
    '—';
  return `${desc}: ${num}`;
};

export default function RegistryPage() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number>(0);

  const { data: taxPayers, isLoading: isLoadingTaxPayers } = useTaxPayer({});

  const {
    data: taxReceipts,
    isLoading: isLoadingTaxReceipts,
    isFetching: isFetchingTaxRecipts,
  } = useTaxReceipts({
    taxPayerId: selectedId,
  });
  console.log(selectedId);
  const selectedRegistry = taxPayers?.data.find(
    (taxPayer: TaxPayer) => taxPayer.id === selectedId
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">DGII Recaudo</h1>
        <p className="text-muted-foreground">
          Administrar Contribuyentes y sus Comprobantes Fiscales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedId && (
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
              <CardDescription>
                Seleccione un contribuyente para visualizar sus comprobantes
                fiscales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar Contribuyentes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="p-1 space-y-2 max-h-96 overflow-y-auto">
                {isLoadingTaxPayers ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </Card>
                  ))
                ) : taxPayers?.data?.length === 0 ? (
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
                          selectedId === taxPayer.id
                            ? 'ring-2 ring-primary'
                            : ''
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
                                    estado === 'Activo'
                                      ? 'outline'
                                      : 'destructive'
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

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comprobantes Fiscales</CardTitle>
              <CardDescription>
                {selectedRegistry
                  ? `Comprobantes Fiscales relacionados a ${getDisplayName(
                      selectedRegistry
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
                    Select a registry{' '}
                    <span className="hidden md:inline">from the left </span>to
                    view related items
                  </p>
                </div>
              ) : isLoadingTaxReceipts || isFetchingTaxRecipts ? (
                <div className="p-1 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <div></div>
                    </Card>
                  ))}
                </div>
              ) : taxReceipts?.data?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No related registries found
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {taxReceipts?.data?.map((receipt) => {
                    const name = getDisplayName(receipt.taxPayer);
                    const docLabel = getDocLabelFromTaxPayer(receipt.taxPayer);
                    const tipo =
                      receipt.taxPayer.taxPayerType.description ?? '—';
                    const docTipo =
                      receipt.taxPayer.documentType.description ?? '—';

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
            {selectedId &&
              !isLoadingTaxReceipts &&
              !isFetchingTaxRecipts &&
              taxReceipts?.data && (
                <CardFooter className="flex justify-end">
                  <span className="px-3 py-1 rounded-md bg-muted font-semibold text-primary">
                    {`Total ITBIS: ${formatRD(
                      taxReceipts.data.reduce(
                        (sum, it) => sum + (it.itbis ?? 0),
                        0
                      )
                    )}`}
                  </span>
                </CardFooter>
              )}
          </Card>
        </div>
      </div>
    </div>
  );
}
