import { formatPrice } from './utils';

test('formatPrice', () => {
  expect(formatPrice(1)).toBe('$1.00');
  expect(formatPrice(10)).toBe('$10.00');
  expect(formatPrice(100)).toBe('$100.00');
  expect(formatPrice(1000)).toBe('$1.00K');
  expect(formatPrice(10000)).toBe('$10.00K');
  expect(formatPrice(100000)).toBe('$100.00K');
  expect(formatPrice(1000000)).toBe('$1.00M');
  expect(formatPrice(10000000)).toBe('$10.00M');
});
