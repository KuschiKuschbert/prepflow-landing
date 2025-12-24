'use client';

interface Step5TaxFileNumberProps {
  taxFileNumber: string;
  onTaxFileNumberChange: (value: string) => void;
}

/**
 * Step 5: Tax File Number component
 */
export function Step5TaxFileNumber({
  taxFileNumber,
  onTaxFileNumberChange,
}: Step5TaxFileNumberProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[var(--foreground)]">Step 5: Tax File Number</h3>
      <div>
        <label className="mb-2 block text-sm text-[var(--foreground-muted)]">
          Tax File Number (TFN)
        </label>
        <input
          type="text"
          value={taxFileNumber ?? ''}
          onChange={e => onTaxFileNumberChange(e.target.value)}
          placeholder="000 000 000"
          maxLength={11}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 px-4 py-2 text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
        />
        <p className="mt-2 text-xs text-[var(--foreground-subtle)]">
          Your TFN is kept secure and encrypted
        </p>
      </div>
    </div>
  );
}
