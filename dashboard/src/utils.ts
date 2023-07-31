export const roundPrice = (v: string | number) => {
  const vv = typeof v === 'string' ? parseFloat(v) : v;

  return Math.round(vv * 100) / 100;
};

const M = 10 ** 6;
const K = 10 ** 3;

export const formatUSD = (val: any) => {
  const amount = parseFloat(val);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatISTRaw = (val: any) => {
  const amount = parseFloat(val);

  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
  }).format(amount);
};

const LONG_DASH = '—';

export const makeCoinFormatter = (format: any) => (v: any) => {
  if (!v && v !== 0) {
    return LONG_DASH;
  }

  if (v >= M) {
    return `${format(roundPrice(v / M))}M`;
  }

  if (v >= K) {
    return `${format(roundPrice(v / K))}K`;
  }

  return `${format(roundPrice(v))}`;
};

export const formatPrice = makeCoinFormatter(formatUSD);
export const formatIST = makeCoinFormatter(formatISTRaw);

export const formatPercent = (v: any) => `${roundPrice(v * 100)}%`;
