import type { TaxPayer } from './tax-payer';
import type { Pagination } from './api';

export interface TaxReceipt {
  id: number;
  taxPayer: TaxPayer;
  ncf: string;
  amount: number;
  itbis: number;
  generatedAt: string;
}

export interface TaxReceiptsResponse {
  data: TaxReceipt[];
  pagination: Pagination;
}
