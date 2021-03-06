const path = require('path');

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public', 'js'),
  },
  mode: 'development'
};