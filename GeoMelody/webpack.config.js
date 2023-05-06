const path = require('path');

module.exports = [
  {
    mode: 'development',
    entry: './js/scan.js',
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js'
    },
    watch: true
  },
  {
    mode: 'development',
    entry: './js/index.js',
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle2.js'
    },
    watch: true
  },
];