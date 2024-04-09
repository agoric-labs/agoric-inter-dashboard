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
