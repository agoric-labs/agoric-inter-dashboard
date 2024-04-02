export const coinLabels: { [key: string]: string } = {
  DAI_axl: 'IST ↔ DAI (Axelar)',
  DAI_grv: 'IST ↔ DAI (Gravity)',
  USDT_axl: 'IST ↔ USDT (Axelar)',
  USDT_grv: 'IST ↔ USDT (Gravity)',
  USDC_axl: 'IST ↔ USDC (Axelar)',
  USDC_grv: 'IST ↔ USDC (Gravity)',
};

export const formatCoinLabels = (v: string) => coinLabels[v] || v;
