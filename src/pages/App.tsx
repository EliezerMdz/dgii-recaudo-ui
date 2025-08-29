import { useState } from 'react';

import { TaxPayersPanel } from '@/components/tax-payers-panel';
import { TaxReceiptsPanel } from '@/components/tax-receipts-panel';
import { useTaxPayer } from '@/services/queries/tax-payer';
import { useTaxReceipts } from '@/services/queries/tax-receipts';
import { type TaxPayerTypeId } from '@/types/tax-payer';

export default function RegistryPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [taxPayerTypeId, setTaxPayerTypeId] = useState<TaxPayerTypeId | null>(
    null
  );

  const {
    data: taxPayers,
    isLoading: isLoadingTaxPayers,
    isError: isErrorTaxPayer,
    error: taxPayersError,
    refetch: refetchTaxPayers,
  } = useTaxPayer({ taxPayerType: taxPayerTypeId ?? undefined });

  const {
    data: taxReceipts,
    isLoading: isLoadingTaxReceipts,
    isFetching: isFetchingTaxRecipts,
    isError: isErrorTaxReceipts,
    error: taxReceiptsError,
    refetch: refetchTaxReceipts,
  } = useTaxReceipts({
    taxPayerId: selectedId ?? 0,
  });

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">DGII Recaudo</h1>
        <p className="text-muted-foreground">
          Administrar Contribuyentes y sus Comprobantes Fiscales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaxPayersPanel
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          taxPayerTypeId={taxPayerTypeId}
          setTaxPayerTypeId={setTaxPayerTypeId}
          taxPayers={taxPayers}
          isLoadingTaxPayers={isLoadingTaxPayers}
          isErrorTaxPayer={isErrorTaxPayer}
          taxPayersError={taxPayersError}
          refetchTaxPayers={refetchTaxPayers}
        />
        <TaxReceiptsPanel
          selectedId={selectedId}
          isLoadingTaxReceipts={isLoadingTaxReceipts}
          isFetchingTaxReceipts={isFetchingTaxRecipts}
          isErrorTaxReceipts={isErrorTaxReceipts}
          taxReceipts={taxReceipts}
          taxReceiptsError={taxReceiptsError}
          refetchTaxReceipts={refetchTaxReceipts}
        />
      </div>
    </div>
  );
}
