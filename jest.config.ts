export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '^.+\\.svg$': '<rootDir>/tests/transformers/svgTransform.cjs',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
