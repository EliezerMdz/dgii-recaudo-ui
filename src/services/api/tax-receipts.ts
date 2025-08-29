import type {
  TaxReceiptsResponse,
  TaxReceiptsSummaryResponse,
} from '@/types/tax-receipt';
import { apiFetch, buildQuery, toIso } from '@/utils';

export type TaxReceiptsParams = {
  taxPayerId: number;
  startDate?: string | Date;
  endDate?: string | Date;
  pageNumber?: number;
  limit?: number;
};

export type TaxReceiptsSummaryParams = {
  taxPayerId: number;
};

export async function getTaxReceipts(
  params: TaxReceiptsParams
): Promise<TaxReceiptsResponse> {
  const qs = buildQuery({
    taxPayerId: params.taxPayerId,
    startDate: toIso(params.startDate),
    endDate: toIso(params.endDate),
    pageNumber: params.pageNumber,
    limit: params.limit,
  });
  const res = await apiFetch(`taxreceipts?${qs}`);
  if (!res.ok) throw new Error('Failed to load tax receipts');
  return res.json();
}

export async function getTaxReceiptsSummary(
  params: TaxReceiptsSummaryParams
): Promise<TaxReceiptsSummaryResponse> {
  const qs = buildQuery({
    taxPayerId: params.taxPayerId,
  });
  const res = await apiFetch(`taxreceipts/summary?${qs}`);
  if (!res.ok) throw new Error('Failed to load tax receipts summary');
  return res.json();
}
