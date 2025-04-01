/* eslint-disable @typescript-eslint/no-require-imports */
import type { Configuration, WebpackPluginInstance } from 'webpack';
import path from 'path';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
const TerserPlugin = require('terser-webpack-plugin');

type BuildEnv = {
    mode?: 'production' | 'development';
    analyze?: boolean;
};

const toAbsolute = (newPath = '') => path.resolve(__dirname, newPath);

const config = async (env: BuildEnv = {}): Promise<Configuration> => {
    const isProduction = env.mode === 'production';
    const mode = isProduction ? 'production' : 'development';
    const plugins: WebpackPluginInstance[] = [
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                diagnosticOptions: { semantic: true, syntactic: true },
                mode: 'write-references',
            },
        }),
    ];

    // 按需加载Bundle Analyzer
    if (env.analyze) {
        const { BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer');
        plugins.push(new BundleAnalyzerPlugin());
    }

    return {
        mode,
        entry: {
            main: './src/index.ts',
        },
        output: {
            path: toAbsolute('dist'),
            filename: '[name].[contenthash:8].js', // 添加哈希指纹
            libraryTarget: 'umd',
            globalObject: 'this',
            clean: true, // 替代clean-webpack-plugin
        },
        devtool: isProduction ? 'hidden-source-map' : 'eval-cheap-module-source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
            alias: {
                '@': toAbsolute('src'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader', // Babel配置已外置到.babelrc.js
                    },
                },
            ],
        },
        plugins,
        optimization: {
            usedExports: true,
            minimize: isProduction,
            sideEffects: true,
            providedExports: true,
            minimizer: isProduction
                ? [
                      new TerserPlugin({
                          terserOptions: {
                              compress: {
                                  pure_getters: true,
                              },
                          },
                      }),
                  ]
                : [],
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        name: 'vendors',
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
            runtimeChunk: 'single', // 提取运行时代码
        },
        externals: {},
    };
};

export default config;
