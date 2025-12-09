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
      <h3 className="text-lg font-semibold text-white">Step 5: Tax File Number</h3>
      <div>
        <label className="mb-2 block text-sm text-gray-400">Tax File Number (TFN)</label>
        <input
          type="text"
          value={taxFileNumber ?? ''}
          onChange={e => onTaxFileNumberChange(e.target.value)}
          placeholder="000 000 000"
          maxLength={11}
          className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
        />
        <p className="mt-2 text-xs text-gray-500">Your TFN is kept secure and encrypted</p>
      </div>
    </div>
  );
}
