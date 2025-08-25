import type { Pagination } from './api';

export interface TaxPayerType {
  id: number;
  code: string;
  description: string;
  isActive: boolean;
}

export interface DocumentType {
  id: number;
  code: string;
  description: string;
  isActive: boolean;
}

export interface NaturalPerson {
  id: number;
  documentType: DocumentType;
  documentNumber: string;
  firstName: string;
  middleName?: string;
  firstLastName: string;
  secondLastName?: string;
  birthday: string;
  isActive: boolean;
}

export interface LegalEntity {
  id: number;
  rnc: string;
  name: string;
  isActive: boolean;
}

export interface TaxPayer {
  id: number;
  taxPayerType: TaxPayerType;
  documentType: DocumentType;
  documentNumber: string;
  isActive: boolean;
  naturalPerson?: NaturalPerson;
  legalEntity?: LegalEntity;
}

export interface TaxPayersResponse {
  data: TaxPayer[];
  pagination: Pagination;
}

export const TAX_PAYER_TYPES = [
  { id: 1, code: 'PER', description: 'Persona Física', isActive: true },
  { id: 2, code: 'EMP', description: 'Empresa', isActive: true },
] as const;

export type TaxPayerTypeId = (typeof TAX_PAYER_TYPES)[number]['id']; // 1 | 2
export type TaxPayerTypeCode = (typeof TAX_PAYER_TYPES)[number]['code']; // 'PER' | 'EMP'

export const TAX_PAYER_TYPE_CODE_TO_ID: Record<
  TaxPayerTypeCode,
  TaxPayerTypeId
> = {
  PER: 1,
  EMP: 2,
};

export const TAX_PAYER_TYPE_ID_TO_LABEL: Record<TaxPayerTypeId, string> = {
  1: 'Persona Física',
  2: 'Empresa',
};
