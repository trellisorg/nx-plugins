module.exports = {
    name: 'make-buildable',
    preset: '../../jest.preset.js',
    transform: {
        '^.+\\.[tj]sx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
    coverageDirectory: '../../coverage/packages/make-buildable',
    globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
};
