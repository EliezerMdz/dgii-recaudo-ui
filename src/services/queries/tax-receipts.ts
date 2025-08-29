import {
  type TaxReceiptsParams,
  type TaxReceiptsSummaryParams,
  getTaxReceipts,
  getTaxReceiptsSummary,
} from '@/services/api/tax-receipts';
import type {
  TaxReceiptsResponse,
  TaxReceiptsSummaryResponse,
} from '@/types/tax-receipt';
import { toIso } from '@/utils';
import { useQuery } from '@tanstack/react-query';

const ONE_MINUTE = 60 * 1000;

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

export function useTaxReceiptsSummary(params: TaxReceiptsSummaryParams) {
  const key = {
    ...params,
  };

  return useQuery<TaxReceiptsSummaryResponse>({
    queryKey: ['taxreceiptssummary', key],
    queryFn: () => getTaxReceiptsSummary(key),
    staleTime: ONE_MINUTE,
    enabled: Number.isFinite(params.taxPayerId) && params.taxPayerId > 0,
  });
}
