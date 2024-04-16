import '@endo/init';
import { makeMarshal } from '@endo/marshal';
import { Far } from '@endo/far';

const convertSlotToVal = (slot: any, iface?: string) => {
    if (!iface) {
        return '???';
    }

    return Far(iface, {
        getIface: () => iface.replace('Alleged: ', ''),
    });
};

export const { fromCapData: unserialize } = makeMarshal(undefined, convertSlotToVal);


const roundPrice = (v: string | number) => {
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

const formatISTRaw = (val: any) => {
    const amount = parseFloat(val);

    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
    }).format(amount);
};

const LONG_DASH = '—';

const makeCoinFormatter = (formatFn: any) => (v: any) => {
    if (!v && v !== 0) {
        return LONG_DASH;
    }

    if (v >= M) {
        return `${formatFn(roundPrice(v / M))}M`;
    }

    if (v >= K) {
        return `${formatFn(roundPrice(v / K))}K`;
    }

    return `${formatFn(roundPrice(v))}`;
};

export const formatIST = makeCoinFormatter(formatISTRaw);

export const formatPercent = (v: any) => `${roundPrice(v * 100)}%`;

export const formatPrice = makeCoinFormatter(formatUSD);

export const extractFormattedNumber = (formattedValue: string) => {
    const formattedValueCleaned = formattedValue.trim();
    const firstSymbol: any = formattedValueCleaned.at(0);
    const lastSymbol: any = formattedValueCleaned.at(-1);
    const numberString = formattedValueCleaned.slice(isNaN(firstSymbol) ? 1 : 0, isNaN(lastSymbol) ? -1 : undefined);
    const number = Number(numberString.replaceAll(',', ''));

    return [isNaN(firstSymbol) ? firstSymbol : null, number, isNaN(lastSymbol) ? lastSymbol : null];
};
