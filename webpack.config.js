var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs-extra'),
  env = require('./utils/env'),
  { CleanWebpackPlugin } = require('clean-webpack-plugin'),
  BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin');

const BROWSER_MANIFEST = {
  chrome: 'src/manifest-chrome.json',
  firefox: 'src/manifest-firefox.json',
};

const ASSET_PATH = process.env.ASSET_PATH || '/';

var alias = {
  'react-dom': '@hot-loader/react-dom',
};

// load the secrets
var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

var options = (args) => {
  const BROWSER_ENV = args.browser || 'chrome';
  let opts = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
      options: path.join(__dirname, 'src', 'pages', 'Options', 'index.ts'),
      background: path.join(
        __dirname,
        'src',
        'pages',
        'Background',
        'index.ts'
      ),
      contentScript: path.join(
        __dirname,
        'src',
        'pages',
        'Content',
        'index.ts'
      ),
    },
    chromeExtensionBoilerplate: {
      notHotReload: ['background', 'contentScript'],
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].bundle.js',
      publicPath: ASSET_PATH,
    },
    module: {
      rules: [
        {
          // look for .css or .scss files
          test: /\.(css)$/,
          // in the `src` directory
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
          ],
        },
        {
          test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
          exclude: /node_modules/,
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
          exclude: /node_modules/,
        },
        { test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/ },
        {
          test: /\.(js|jsx)$/,
          use: [
            {
              loader: 'source-map-loader',
            },
            {
              loader: 'babel-loader',
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      alias: alias,
      extensions: fileExtensions
        .map((extension) => '.' + extension)
        .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
    },
    plugins: [
      new webpack.ProgressPlugin(),
      // clean the build folder
      new CleanWebpackPlugin({
        verbose: true,
        cleanStaleWebpackAssets: false,
      }),
      // expose and write the allowed env vars on the compiled bundle
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: BROWSER_MANIFEST[BROWSER_ENV],
            to: path.join(__dirname, 'build', 'manifest.json'),
            force: true,
            transform: function (content) {
              // generates the manifest file using the package.json informations
              return Buffer.from(
                JSON.stringify({
                  description: process.env.npm_package_description,
                  version: process.env.npm_package_version,
                  ...JSON.parse(content.toString()),
                })
              );
            },
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/pages/Content/content.styles.css',
            to: path.join(__dirname, 'build'),
            force: true,
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/assets/img',
            to: path.join(__dirname, 'build'),
            force: true,
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'pages', 'Options', 'index.html'),
        filename: 'options.html',
        chunks: ['options'],
        cache: false,
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'pages', 'Popup', 'index.html'),
        filename: 'popup.html',
        chunks: ['popup'],
        cache: false,
      }),
      new webpack.DefinePlugin({
        'process.env.DEMO': JSON.stringify(env.DEMO),
      }),
      // new BundleAnalyzerPlugin(),
    ],
    infrastructureLogging: {
      level: 'info',
    },
  };

  if (env.NODE_ENV === 'development') {
    opts.devtool = 'cheap-module-source-map';
  } else {
    opts.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    };
  }

  return opts;
};

module.exports = options;
