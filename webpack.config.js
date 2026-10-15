import { basename, dirname, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import purgeCss from '@fullhuman/postcss-purgecss';
import defaultConfig from '@wordpress/scripts/config/webpack.config.js';
import postcssNesting from 'postcss-nesting';
import purgecssWordpress from 'purgecss-with-wordpress';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

const __file = fileURLToPath( import.meta.url );
const __dir = dirname( __file );

const purgeOptions = {
    content: [
        resolve( __dir, 'frontend/**/*.{js,jsx,ts,tsx}' ),
        resolve( __dir, 'includes/ui/**/*.php' ),
        resolve( __dir, 'assets/js/admin.js' ),
    ],
    safelist: {
        standard: [ ...purgecssWordpress.safelist, 'inside', 'active', /^components-/, /^apexcharts-/ ],
    },
    keyframes: false,
    variables: false,
    fontFace: false,
};

const isProduction = process.env.NODE_ENV === 'production';

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

                    const plugins = [ ...postcssOptions.plugins ];
                    const importIndex = plugins.findIndex( ( plugin ) => plugin.postcssPlugin === 'postcss-import' );

                    // Flatten nesting and purge after imports, or first if no import plugin is configured.
                    plugins.splice(
                        importIndex + 1,
                        0,
                        postcssNesting(),
                        ...( isProduction ? [ purgeCss( purgeOptions ) ] : [] ),
                    );

                    return {
                        ...loader,
                        options: {
                            ...loader.options,
                            postcssOptions: {
                                ...postcssOptions,
                                plugins,
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
            publicPath: 'dist/',
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
