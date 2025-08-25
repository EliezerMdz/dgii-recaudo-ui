import type { TaxPayersResponse } from '@/types/tax-payer';
import type { TaxReceiptsResponse } from '@/types/tax-receipt';
import { apiFetch } from '@/utils';
import { toIso, buildQuery } from '@/utils/query';
import { TAX_PAYER_TYPE_CODE_TO_ID } from '../../types/tax-payer';

export type GetTaxPayersParams = {
  taxPayerType?: 1 | 2 | 'PER' | 'EMP';
  pageNumber?: number;
  limit?: number;
};
export async function getTaxPayers(
  params: GetTaxPayersParams
): Promise<TaxPayersResponse> {
  const qs = new URLSearchParams();

  if (params.taxPayerType != null) {
    const id =
      typeof params.taxPayerType === 'string'
        ? TAX_PAYER_TYPE_CODE_TO_ID[params.taxPayerType]
        : params.taxPayerType;
    qs.set('taxPayerTypeId', String(id));
  }
  if (params.pageNumber != null)
    qs.set('pageNumber', String(params.pageNumber));
  if (params.limit != null) qs.set('limit', String(params.limit));

  const res = await apiFetch(`taxpayers?${qs.toString()}`);
  return res.json();
}

export type TaxReceiptsParams = {
  taxPayerId: number;
  startDate?: string | Date;
  endDate?: string | Date;
  pageNumber?: number;
  limit?: number;
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
