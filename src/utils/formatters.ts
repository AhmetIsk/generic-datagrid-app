/**
 * Utility functions for formatting values
 */

export const fieldNameMapping: Record<string, string> = {
  'Brand': 'Manufacturer',
  'Model': 'Model',
  'BodyStyle': 'Body Style',
  'Segment': 'Segment',
  'AccelSec': 'Acceleration (0-100 km/h)',
  'TopSpeed_KmH': 'Top Speed',
  'Range_Km': 'Range',
  'Efficiency_WhKm': 'Efficiency',
  'FastCharge_KmH': 'Fast Charge Speed',
  'RapidCharge': 'Rapid Charge',
  'PowerTrain': 'Power Train',
  'PlugType': 'Plug Type',
  'Seats': 'Seats',
  'PriceEuro': 'Price',
  'Date': 'Release Date'
};

export const valueFormatters: Record<string, (value: any) => string> = {
  'AccelSec': (value) => `${value} sec`,
  'TopSpeed_KmH': (value) => `${value} km/h`,
  'Range_Km': (value) => `${value} km`,
  'Efficiency_WhKm': (value) => `${value} Wh/km`,
  'FastCharge_KmH': (value) => value ? `${value} km/h` : 'N/A',
  'PriceEuro': (value) => `€${value.toLocaleString()}`,
  'Date': (value) => new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
};

/**
 * Format a field value with specialized formatter or default
 */
export const formatValue = (key: string, value: any): string => {
  if (value === null || value === undefined) return 'N/A';

  if (valueFormatters[key]) {
    return valueFormatters[key](value);
  }

  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

/**
 * Get user-friendly field name
 */
export const getFieldLabel = (key: string): string => {
  return fieldNameMapping[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
};

/**
 * Format a price as Euro
 */
export const formatEuroPrice = (price: number | undefined | null): string => {
  return price ? `€${price.toLocaleString()}` : 'N/A';
};