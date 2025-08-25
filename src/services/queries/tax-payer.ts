import { useQuery } from '@tanstack/react-query';
import type { TaxPayersResponse } from '@/types/tax-payer';
import type { TaxReceiptsResponse } from '@/types/tax-receipt';
import {
  getTaxPayers,
  getTaxReceipts,
  type TaxReceiptsParams,
  type GetTaxPayersParams,
} from '../api/tax-payer';
import { toIso } from '@/utils/query';

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

export function useTaxReceipts(params: TaxReceiptsParams) {
  const key = {
    ...params,
    startDate: toIso(params.startDate),
    endDate: toIso(params.endDate),
  };

  return useQuery<TaxReceiptsResponse>({
    queryKey: ['taxreceipts', key],
    queryFn: () => getTaxReceipts(key),
    staleTime: ONE_MINUTE,
    enabled: Number.isFinite(params.taxPayerId) && params.taxPayerId > 0,
  });
}
