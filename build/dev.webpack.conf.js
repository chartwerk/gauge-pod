const baseWebpackConfig = require('./base.webpack.conf');

var conf = baseWebpackConfig;
conf.devtool = 'inline-source-map';
conf.watch = true;
conf.mode = 'development';

module.exports = conf;
