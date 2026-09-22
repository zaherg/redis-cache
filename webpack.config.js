import { basename, dirname, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import defaultConfig from '@wordpress/scripts/config/webpack.config.js';
import postcssNesting from 'postcss-nesting';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

const __file = fileURLToPath( import.meta.url );
const __dir = dirname( __file );

export default {
    ...defaultConfig,
    module: {
        ...defaultConfig.module,
        rules: defaultConfig.module.rules.map( ( rule ) => {
            if ( ! Array.isArray( rule.use ) ) {
                return rule;
            }

            return {
                ...rule,
                use: rule.use.map( ( loader ) => {
                    const postcssOptions = loader.options?.postcssOptions;
                    if ( ! postcssOptions ) {
                        return loader;
                    }

                    return {
                        ...loader,
                        options: {
                            ...loader.options,
                            postcssOptions: {
                                ...postcssOptions,
                                // WordPress leaves CSS nesting intact; flatten it for browsers without native support.
                                // Run after imports, before prefixing and minification.
                                plugins: postcssOptions.plugins.flatMap( ( plugin ) =>
                                    plugin.postcssPlugin === 'autoprefixer' ? [ postcssNesting(), plugin ] : [ plugin ],
                                ),
                            },
                        },
                    };
                } ),
            };
        } ),
    },
    entry: {
        settings: resolve( __dir, 'frontend/settings/main.tsx' ),
    },
    output: {
        ...defaultConfig.output,
        path: resolve( __dir, 'public/dist' ),
        clean: {
            keep: /^\.gitignore$/,
        },
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: 'auto',
    },
    plugins: [
        ...defaultConfig.plugins,
        new WebpackManifestPlugin( {
            fileName: '../manifest.json',
            publicPath: 'dist/',
            generate( seed, files, entrypoints ) {
                const assets = files.reduce(
                    ( assets, file ) => {
                        const path = posix.normalize( file.path );
                        const name = path.endsWith( '.css' )
                            ? posix.relative( 'dist', path )
                            : posix.normalize( file.name );

                        assets[ name ] = path;
                        return assets;
                    },
                    { ...seed },
                );

                return {
                    assets,
                    entrypoints: Object.fromEntries(
                        Object.entries( entrypoints ).map( ( [ name, filenames ] ) => {
                            // Keep webpack's dependency order and align metadata with its script.
                            const scripts = filenames.filter( ( filename ) => filename.endsWith( '.js' ) );

                            return [
                                name,
                                {
                                    assets: scripts
                                        .map( ( script ) => script.replace( /\.js$/, '.asset.php' ) )
                                        .filter( ( asset ) => filenames.includes( asset ) ),
                                    scripts,
                                },
                            ];
                        } ),
                    ),
                };
            },
        } ),
    ],
    optimization: {
        ...defaultConfig.optimization,
        runtimeChunk: 'single',
        splitChunks: {
            ...defaultConfig.optimization.splitChunks,
            cacheGroups: {
                ...defaultConfig.optimization.splitChunks.cacheGroups,
                style: {
                    ...defaultConfig.optimization.splitChunks.cacheGroups.style,
                    name( _, chunks ) {
                        const chunkName = chunks[ 0 ].name;
                        return `${ dirname( chunkName ) }/${ basename( chunkName ) }`;
                    },
                },
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
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve.alias,
            '@redis-cache': resolve( __dir, 'frontend' ),
        },
    },
};
