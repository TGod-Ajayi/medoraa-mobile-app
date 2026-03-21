// Monorepo: merge Expo defaults with workspace root so Metro + doctor stay happy,
// and resolve a single hoisted react/react-native (fixes duplicate-React crashes).
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

const defaultWatch = config.watchFolders ?? [];
config.watchFolders = [...new Set([...defaultWatch, monorepoRoot])];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Prefer the hoisted root node_modules (npm workspaces).
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
