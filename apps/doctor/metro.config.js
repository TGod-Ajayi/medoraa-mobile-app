const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Monorepo: resolve shared packages from the workspace root so Metro never loads
// two copies of native modules (RNGH, react-native-svg, etc.).
const defaultWatch = config.watchFolders ?? [];
config.watchFolders = [...new Set([...defaultWatch, monorepoRoot])];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Prefer the hoisted root node_modules (npm workspaces).
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
