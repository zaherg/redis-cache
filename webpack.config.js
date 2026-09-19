import { basename, dirname, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import purgeCss from '@fullhuman/postcss-purgecss';
import defaultConfig from '@wordpress/scripts/config/webpack.config.js';
import postcssNesting from 'postcss-nesting';
import purgeCssWordpress from 'purgecss-with-wordpress';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

const __file = fileURLToPath( import.meta.url );
const __dir = dirname( __file );

const purgeOptions = {
    content: [ resolve( __dir, 'frontend/**/*.{js,jsx,ts,tsx}' ) ],
    safelist: {
        standard: [
            ...purgeCssWordpress.safelist,
            'dashboard_rediscache',
            'inside',
            'active',
            /^components-/,
            /^apexcharts-/,
        ],
    },
    keyframes: false,
    variables: false,
    fontFace: false,
};

const isProduction = process.env.NODE_ENV === 'production';
const apexChartsPath = resolve( __dir, 'node_modules/apexcharts/dist/apexcharts.esm.js' );
const designTokensPath = resolve( __dir, 'node_modules/@wordpress/theme/prebuilt/css/design-tokens.css' );

// PostCSS plugin: prepend an @import for the WordPress design tokens to the
// settings stylesheet so postcss-import can inline them during the build.
function prependDesignTokens( tokensPath ) {
    return {
        postcssPlugin: 'redis-cache-design-tokens',
        // biome-ignore lint/style/useNamingConvention: 'Once' is PostCSS's required plugin hook name.
        Once( root ) {
            const file = root.source?.input?.file ?? '';
            // Only touch the settings stylesheet; tokens' file itself must stay untouched.
            if ( ! file.endsWith( '/frontend/settings/style.css' ) ) return;

            // Avoid duplicating an import that already exists at the top.
            if ( root.first?.type === 'atrule' && /design-tokens\.css/.test( root.first.params ) ) return;

            root.prepend( `@import ${ JSON.stringify( tokensPath ) };` );
        },
    };
}

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
                    let importIndex = plugins.findIndex( ( plugin ) => plugin.postcssPlugin === 'postcss-import' );

                    // Flatten nesting and purge after imports, or first if no import plugin is configured.
                    plugins.splice(
                        importIndex + 1,
                        0,
                        postcssNesting(),
                        ...( isProduction ? [ purgeCss( purgeOptions ) ] : [] ),
                    );

                    // Re-locate postcss-import after the splice, then inject design tokens before it
                    // so the import is inlined into the settings stylesheet.
                    importIndex = plugins.findIndex( ( plugin ) => plugin.postcssPlugin === 'postcss-import' );
                    if ( importIndex >= 0 ) {
                        plugins.splice( importIndex, 0, prependDesignTokens( designTokensPath ) );
                    }

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
    externals: {
        ...defaultConfig.externals,
        apexcharts: 'window.ApexCharts',
    },
    entry: {
        settings: resolve( __dir, 'frontend/settings/main.tsx' ),
        // Keep the engine separate so WP_REDIS_LOAD_APEXCHARTS can opt out.
        charts: {
            import: apexChartsPath,
            runtime: false,
            library: { name: 'ApexCharts', type: 'window', export: 'default' },
        },
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
    performance: {
        ...defaultConfig.performance,
        maxAssetSize: 768 * 1024,
        maxEntrypointSize: 768 * 1024,
    },
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
                    test: ( module ) =>
                        /[\\/]node_modules[\\/]/.test( module.resource || '' ) && module.resource !== apexChartsPath,
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
            '@wpds/design-tokens': resolve( __dir, 'node_modules/@wordpress/theme/prebuilt/css' ),
        },
    },
};
