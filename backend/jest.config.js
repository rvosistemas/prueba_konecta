export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['js', 'json', 'node'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middlewares/**/*.js',
    'models/**/*.js',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'html'],
};
