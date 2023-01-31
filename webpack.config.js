module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {
              debug: false,
              corejs: 3,
              useBuiltIns: "usage"
            }]]
          }
        }
      }
    ]
  },
  watch: false,
  output: {
    filename: 'main.js',
  }
};