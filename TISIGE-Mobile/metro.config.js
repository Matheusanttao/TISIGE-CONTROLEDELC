// Configuração Metro — Expo + Web (react-native-web).
// Zustand publica ESM (.mjs) com `import.meta`, que quebra no browser sem type="module".
// Forçamos os entrypoints CommonJS (.js), iguais ao que o Node resolve.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const zustandRoot = path.dirname(require.resolve('zustand/package.json'));

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand') {
    return {
      filePath: path.join(zustandRoot, 'index.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'zustand/middleware') {
    return {
      filePath: path.join(zustandRoot, 'middleware.js'),
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
