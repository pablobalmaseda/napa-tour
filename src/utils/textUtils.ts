/**
 * Strips markdown links and raw URLs from food pairing strings for clean TV presentation
 */
export const cleanFoodPairingText = (text?: string): string => {
  if (!text) return '';
  return text
    // Replace markdown links [label](url) with label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove raw URLs
    .replace(/https?:\/\/[^\s)]+/g, '')
    // Clean up awkward leftover phrasing from raw URLs
    .replace(/either of these\s+or\s+/i, '')
    .replace(/\(\s*or\s+/i, '(')
    // Clean up multiple spaces
    .replace(/\s{2,}/g, ' ')
    .trim();
};
