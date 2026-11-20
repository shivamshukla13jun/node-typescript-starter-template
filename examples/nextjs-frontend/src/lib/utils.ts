/** Tiny className joiner — filters falsy values. */
export const cn = (
  ...classes: (string | false | null | undefined)[]
): string => classes.filter(Boolean).join(' ');

export const formatDate = (value?: string | Date): string => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString();
};
