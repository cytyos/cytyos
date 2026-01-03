import type { Currency, UnitSystem } from '../stores/settingsStore';
import { currencyLocaleMap, currencySymbolMap } from '../stores/settingsStore';

export function formatArea(valueInSqMeters: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'imperial') {
    const sqFeet = valueInSqMeters * 10.764;
    return `${sqFeet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ft²`;
  }

  return `${valueInSqMeters.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m²`;
}

export function formatCurrency(value: number, currency: Currency): string {
  const locale = currencyLocaleMap[currency];

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getCurrencySymbol(currency: Currency): string {
  return currencySymbolMap[currency];
}

export function formatDistance(valueInMeters: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'imperial') {
    const feet = valueInMeters * 3.28084;
    return `${feet.toFixed(2)} ft`;
  }

  return `${valueInMeters.toFixed(2)} m`;
}
