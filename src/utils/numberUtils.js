// Normalizes numeric strings potentially entered with Arabic/Eastern Arabic digits
// and commas, returning a parsable Latin-decimal string.
// Examples:
//  '١٢٫٥' -> '12.5'
//  '١٢,٥' -> '12.5'
//  '۲۰'   -> '20'
export const normalizeNumericString = (value) => {
  if (value === null || value === undefined) return '';
  let s = String(value).trim();

  const arabicIndic = '٠١٢٣٤٥٦٧٨٩';
  const easternArabicIndic = '۰۱۲۳۴۵۶۷۸۹';
  const latin = '0123456789';

  for (let i = 0; i < arabicIndic.length; i++) {
    s = s.split(arabicIndic[i]).join(latin[i]);
  }
  for (let i = 0; i < easternArabicIndic.length; i++) {
    s = s.split(easternArabicIndic[i]).join(latin[i]);
  }

  // Convert localized decimal separators to '.'
  s = s.replace(/[،,٫]/g, '.');

  // Keep only digits, optional minus and dot
  s = s.replace(/[^0-9.\-]/g, '');
  return s;
};


