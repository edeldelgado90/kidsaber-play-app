const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 3D pet models (three.js / react-three-fiber)
config.resolver.assetExts.push('glb');

module.exports = config;
