import type { Pagination } from './api';
import type { TaxPayer } from './tax-payer';

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

export interface TaxReceiptsSummaryResponse {
  taxPayerId: number;
  totalRecords: number;
  totalAmount: number;
  totalITBIS: number;
}
