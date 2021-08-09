const fs = require('fs-extra');
const { compilerOptions } = require('./tsconfig.json');
console.log(compilerOptions);
const tsPaths = compilerOptions.paths;

const jestPaths = {};
Object.keys(tsPaths).forEach((tsKey) => {
    for (const tsValue of tsPaths[tsKey]) {
        if (tsValue.includes('*') || ['', '.ts', '.tsx'].some((ext) => fs.pathExistsSync(`${tsValue}${ext}`))) {
            jestPaths[`^${tsKey.replace('*', '(.*)')}$`] = `<rootDir>/${tsValue.replace('*', '$1')}`;
            break;
        }
    }
});

const config = {
    moduleNameMapper: {
        ...jestPaths,
    },
};

module.exports = config;
