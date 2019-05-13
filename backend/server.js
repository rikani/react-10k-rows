var path = require('path');
var express = require('express');
var webpack = require('webpack');
var parseArgs = require('minimist');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config;

const dataRouter = require('./routes/data');

const argv = parseArgs(process.argv.slice(2));

if (argv.p) {
    config = require('../webpack.prod.config.js');
} else {
    config = require('../webpack.dev.config.js');
}

var app = express();

// view setup
// app.set('views', path.join(__dirname, 'views'));

if (!argv.p) {
    var compiler = webpack(config);
    
    app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath
    }))
    
    app.use(webpackHotMiddleware(compiler))
}

// static assets
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/data', dataRouter);
app.get('/', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../dist/index.html'))
);

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`)
})