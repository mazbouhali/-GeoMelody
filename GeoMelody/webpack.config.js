const path = require('path')

//Takes the source file index.js and bundles them up in webpack called bundle.js
module.exports = {
    mode: 'development',
    entry: './js/index.js', //Where we want webpack to look for our Javascript source file
    output: {
        path: path.resolve(__dirname), //Path for where we want the output file to be put into
        filename: 'bundle.js' //Name of the output file
    },
    watch: true
}