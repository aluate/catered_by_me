/**
 * Gift code service logic
 */

/**
 * Generate a gift code in format: CBM-XXXX-XXXX
 */
export function generateGiftCode(): string {
  // Generate 4 random uppercase letters
  const letters = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");
  // Generate 4 random digits
  const digits = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `CBM-${letters}-${digits}`;
}

