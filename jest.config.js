const path = require('path');

module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [path.resolve(__dirname, 'tests/setup.js')],
  globalTeardown: path.resolve(__dirname, 'tests/teardown.js'),
  testMatch: [
    '**/tests/**/*.test.js',
    '!**/tests/websocket.test.js' // Excluido explícitamente
  ],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1'
  },
  coverageDirectory: path.join(__dirname, 'coverage'),
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/app.js',
    '!src/server.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  verbose: true,
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
};