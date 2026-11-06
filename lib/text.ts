export type CleanOptions = {
  trim: boolean;
  spaces: boolean;
  lines: boolean;
  empty: boolean;
  duplicates: boolean;
  quotes: boolean;
  case: 'unchanged' | 'lower' | 'upper' | 'sentence';
};
export const defaultCleanOptions: CleanOptions = {
  trim: true,
  spaces: true,
  lines: false,
  empty: false,
  duplicates: false,
  quotes: false,
  case: 'unchanged',
};
export function cleanText(text: string, o: CleanOptions): string {
  let result = text.replace(/\r\n?/g, '\n');
  if (o.quotes)
    result = result
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/\u00a0/g, ' ');
  if (o.spaces) result = result.replace(/[^\S\n]+/g, ' ');
  if (o.trim)
    result = result
      .split('\n')
      .map((l) => l.trim())
      .join('\n')
      .trim();
  if (o.empty)
    result = result
      .split('\n')
      .filter((l) => l.trim())
      .join('\n');
  if (o.duplicates) result = [...new Set(result.split('\n'))].join('\n');
  if (o.lines) result = result.replace(/([^\n])\n(?=[^\n])/g, '$1 ').replace(/\n{3,}/g, '\n\n');
  if (o.case === 'lower') result = result.toLowerCase();
  if (o.case === 'upper') result = result.toUpperCase();
  if (o.case === 'sentence')
    result = result
      .toLowerCase()
      .replace(/(^|[.!?]\s+)(\p{L})/gu, (_, p, c) => p + c.toUpperCase());
  return result;
}
export function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/u).length : 0;
}
