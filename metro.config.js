// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

// Block test files from being bundled by Metro
config.resolver.blockList = [
  /.*\/__tests__\/.*/,
  /.*\.test\.(js|ts|tsx)$/
];

module.exports = config;
