import { Button } from '@/components/ui/button';
import { TAX_PAYER_TYPES, type TaxPayerTypeId } from '@/types/tax-payer';
import { Building2, User } from 'lucide-react';
import React from 'react';

type Props = {
  taxPayerTypeId: TaxPayerTypeId | null;
  setTaxPayerTypeId: React.Dispatch<
    React.SetStateAction<TaxPayerTypeId | null>
  >;
  setSelectedId: (id: number | null) => void;
  className?: string;
};

export default function TaxPayersPanelFilters({
  taxPayerTypeId,
  setTaxPayerTypeId,
  setSelectedId,
  className,
}: Props) {
  return (
    <div
      className={['flex flex-wrap items-center gap-2', className]
        .filter(Boolean)
        .join(' ')}
    >
      {TAX_PAYER_TYPES.map((t) => {
        const selected = taxPayerTypeId === t.id;
        return (
          <Button
            key={t.id}
            type="button"
            size="sm"
            variant={selected ? 'default' : 'outline'}
            aria-pressed={selected}
            onClick={() => {
              setTaxPayerTypeId((prev) => (prev === t.id ? null : t.id));
              setSelectedId(null);
            }}
            className="flex items-center gap-2"
          >
            {t.code === 'PER' ? (
              <User className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Building2 className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{t.description}</span>
          </Button>
        );
      })}
    </div>
  );
}
