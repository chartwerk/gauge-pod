const baseWebpackConfig = require('./base.webpack.conf');

var conf = baseWebpackConfig;
conf.mode = 'production';

module.exports = baseWebpackConfig;
