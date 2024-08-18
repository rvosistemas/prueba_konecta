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
    'models/**/*.js',
    'controllers/**/*.js',
    'middlewares/**/*.js',
    'routes/**/*.js',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'html'],
};
