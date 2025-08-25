import type { TaxPayer } from '@/types';

export const isNaturalPerson = (r: TaxPayer) => r?.taxPayerType.code === 'PER';

export const getDisplayName = (r: TaxPayer) => {
  if (isNaturalPerson(r)) {
    return [
      r.naturalPerson?.firstName,
      r.naturalPerson?.middleName,
      r.naturalPerson?.firstLastName,
      r.naturalPerson?.secondLastName,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();
  }
  return r.legalEntity?.name ?? '—';
};

export const getDocLabel = (r: TaxPayer) => {
  const docDesc = r?.documentType.description ?? 'Documento';
  const docNum =
    r?.documentNumber ??
    r?.naturalPerson?.documentNumber ??
    r?.legalEntity?.rnc ??
    '—';
  return `${docDesc}: ${docNum}`;
};

export const getStatus = (r: TaxPayer) => (r.isActive ? 'Activo' : 'Inactivo');

export const formatRD = (n: number) =>
  n.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' });

export const getDocLabelFromTaxPayer = (taxPayer: TaxPayer) => {
  const desc = taxPayer?.documentType.description ?? 'Documento';
  const num =
    taxPayer?.documentNumber ??
    taxPayer?.naturalPerson?.documentNumber ??
    taxPayer?.legalEntity?.rnc ??
    '—';
  return `${desc}: ${num}`;
};
