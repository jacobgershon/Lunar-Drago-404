let sourcePath = './src/contracts';
if (process.env?.ZKSYNC == 'true') {
  sourcePath = './src/contracts-zksync';
} else if (process.env?.OPTIMISTIC == 'true') {
  sourcePath = './src/contracts-optimistic';
}

export const path_configs = {
  sources: sourcePath,
  tests: './test',
  cache: './cache',
  artifacts: './artifacts',
};
