export const extractFilenameFromPathOrUrl = (input) => {
  if (!input) return '';
  try {
    let s = String(input).trim();
    // Decode percent-encoded to get clean names
    try { s = decodeURIComponent(s); } catch {}
    // Remove any query/hash parts
    s = s.split('?')[0].split('#')[0];
    // Take last segment after slash or backslash
    const parts = s.split(/[\\/]/);
    let name = parts[parts.length - 1] || '';
    // Defensive: strip leading "file:" style prefixes accidentally captured
    if (name.startsWith('file:')) {
      name = name.replace(/^file:\/*/i, '');
    }
    return name;
  } catch {
    return '';
  }
};


