const path = require('path');

module.exports = {
    entry: './src/scripts/scripts.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "var",
        library: "main"
    }
};