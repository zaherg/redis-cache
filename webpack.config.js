import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import defaultConfig from '@wordpress/scripts/config/webpack.config.js';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

const __file = fileURLToPath(import.meta.url);
const __dir = dirname(__file);

export default {
    ...defaultConfig,
    entry: {
        settings: resolve(__dir, 'frontend/settings/main.tsx'),
    },
    output: {
        ...defaultConfig.output,
        path: resolve(__dir, 'public/dist'),
        clean: {
            keep: /^\.gitkeep$/,
        },
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: 'auto',
    },
    optimization: {
        ...defaultConfig.optimization,
        runtimeChunk: 'single',
        splitChunks: {
            ...defaultConfig.optimization.splitChunks,
            cacheGroups: {
                ...defaultConfig.optimization.splitChunks.cacheGroups,
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    type: /^javascript/,
                    name: 'vendors',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    plugins: [
        ...defaultConfig.plugins,
        new WebpackManifestPlugin({
            fileName: '../manifest.json',
            publicPath: 'dist/',
            generate(seed, files, entrypoints) {
                const assets = files.reduce(
                    (assets, file) => {
                        assets[file.name] = file.path;
                        return assets;
                    },
                    { ...seed },
                );

                return {
                    assets,
                    entrypoints: Object.fromEntries(
                        Object.entries(entrypoints).map(([name, filenames]) => {
                            // Keep webpack's dependency order and align metadata with its script.
                            const scripts = filenames.filter((filename) =>
                                filename.endsWith('.js'),
                            );

                            return [
                                name,
                                {
                                    assets: scripts
                                        .map((script) =>
                                            script.replace(
                                                /\.js$/,
                                                '.asset.php',
                                            ),
                                        )
                                        .filter((asset) =>
                                            filenames.includes(asset),
                                        ),
                                    scripts,
                                },
                            ];
                        }),
                    ),
                };
            },
        }),
    ],
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve.alias,
            '@redis-cache': resolve(__dir, 'frontend'),
        },
    },
};
