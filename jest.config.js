export default {
    testEnvironment: 'node',
    testEnvironmentOptions: {
        NODE_OPTIONS: '--experimental-vm-modules',
    },
    verbose: true,
    testMatch: ['**/*.test.js'],
    collectCoverage: false,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
};
