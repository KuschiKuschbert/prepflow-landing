interface Step4BankDetailsProps {
  bankBSB: string;
  bankAccount: string;
  onBSBChange: (value: string) => void;
  onAccountChange: (value: string) => void;
}

/**
 * Step 4: Bank Details component
 */
export function Step4BankDetails({
  bankBSB,
  bankAccount,
  onBSBChange,
  onAccountChange,
}: Step4BankDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Step 4: Bank Details</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-gray-400">BSB</label>
          <input
            type="text"
            value={bankBSB ?? ''}
            onChange={e => onBSBChange(e.target.value)}
            placeholder="000-000"
            maxLength={6}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-gray-400">Account Number</label>
          <input
            type="text"
            value={bankAccount ?? ''}
            onChange={e => onAccountChange(e.target.value)}
            placeholder="00000000"
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 px-4 py-2 text-white focus:border-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
