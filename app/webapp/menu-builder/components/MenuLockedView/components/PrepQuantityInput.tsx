/**
 * Prep Quantity Input Component
 * Allows user to input desired prep quantity for scaling recipe card ingredients
 */

'use client';

import { useState } from 'react';

interface PrepQuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function PrepQuantityInput({
  value,
  onChange,
  min = 1,
  max = 1000,
}: PrepQuantityInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numValue = parseInt(newValue, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(min.toString());
      onChange(min);
    } else if (numValue > max) {
      setInputValue(max.toString());
      onChange(max);
    } else {
      setInputValue(numValue.toString());
      onChange(numValue);
    }
  };

  const handleIncrement = () => {
    const newValue = Math.min(value + 1, max);
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - 1, min);
    setInputValue(newValue.toString());
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="prep-quantity" className="text-sm font-medium text-[var(--foreground-secondary)]">
        Prep Quantity:
      </label>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Decrease prep quantity"
        >
          −
        </button>
        <input
          id="prep-quantity"
          type="number"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          className="w-20 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-center text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Increase prep quantity"
        >
          +
        </button>
      </div>
      <span className="text-xs text-[var(--foreground-muted)]">servings</span>
    </div>
  );
}



