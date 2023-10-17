import { rimraf } from 'rimraf';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { build } from 'esbuild';

// read version from package.json
const pkg = JSON.parse(await readFile('package.json'));
process.env.ULTRAVIOLET_VERSION = pkg.version;

const isDevelopment = process.argv.includes('--dev');

await rimraf('dist');
await mkdir('dist');

await copyFile('src/sw.js', 'dist/sw.js');
// no need for this, ir alr has it
// await copyFile('src/uv.config.js', 'dist/uv.config.js');

await build({
    platform: 'browser',
    sourcemap: true,
    minify: !isDevelopment,
    entryPoints: {
        'ir.bundle': './src/rewrite/index.js',
        'ir.client': './src/client/index.js',
        'ir.handler': './src/uv.handler.js',
        'ir.sw': './src/uv.sw.js',
    },
    define: {
        'process.env.ULTRAVIOLET_VERSION': JSON.stringify(
            process.env.ULTRAVIOLET_VERSION
        ),
    },
    bundle: true,
    outdir: 'dist/',
});
