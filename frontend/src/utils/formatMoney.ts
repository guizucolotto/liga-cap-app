// src/utils/formatMoney.ts
export function formatMoney(value: number) {
  if (!value || isNaN(value)) return "-";
  return `$${(value / 1_000_000).toFixed(1)}M`;
}