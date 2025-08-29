import type { TaxPayersResponse } from '@/types/tax-payer';
import { useQuery } from '@tanstack/react-query';
import { getTaxPayers, type GetTaxPayersParams } from '../api/tax-payer';

const ONE_MINUTE = 60_000;

export function useTaxPayer(params: GetTaxPayersParams) {
  const key = {
    taxPayerType: params.taxPayerType ?? null,
    pageNumber: params.pageNumber ?? 1,
    limit: params.limit ?? 10,
  };

  const req: GetTaxPayersParams = {
    taxPayerType: params.taxPayerType ?? undefined,
    pageNumber: params.pageNumber ?? 1,
    limit: params.limit ?? 10,
  };

  return useQuery<TaxPayersResponse>({
    queryKey: ['taxpayers', key],
    queryFn: () => getTaxPayers(req),
    staleTime: ONE_MINUTE,
  });
}
