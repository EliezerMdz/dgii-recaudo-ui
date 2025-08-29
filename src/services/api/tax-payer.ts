import type { TaxPayersResponse } from '@/types/tax-payer';
import { apiFetch } from '@/utils';
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
