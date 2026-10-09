import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['server/vercelHandler.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  packages: 'external',
  outfile: 'api/index.cjs',
  footer: {
    js: 'module.exports = module.exports.default;',
  },
});
