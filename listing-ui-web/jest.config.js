module.exports = {
  name: 'agent-listing-web',
  preset: '../../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html', 'png'],
  testPathIgnorePatterns: ['cypress'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/src/components/**/*.tsx'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.spec.json',
      diagnostics: {
        // ignore the diagnostic error for the invalidFileErrors fixtures
        ignoreCodes: [5056]
      }
    }
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/fileMock.js'
  },
  setupFiles: ['<rootDir>/jest.setup.ts']
};
