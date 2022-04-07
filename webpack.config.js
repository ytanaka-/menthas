const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',

  entry: path.join(__dirname, 'src/frontend/app.js'),

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public/assets')
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
            "vue-style-loader",
            "css-loader",
        ],
      },
      {
        test: /\.svg$/,
        use: {
            loader: 'svg-url-loader',
            options: {
                noquotes: true
            }
        }
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin()
  ]
};