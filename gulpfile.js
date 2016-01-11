const gulp = require('gulp');
const less = require('gulp-less');
const webpack = require('webpack');
const nodemon = require('nodemon');
const path = require('path');
const fs = require('fs');
const Mocha = require('mocha');
const immutable = require('immutable');

function relative(fragment) {
  return path.join(__dirname, fragment);
}

// Collect list of node modules to exclude from server build.
const nodeModules = {};
fs.readdirSync(relative('node_modules'))
  .filter(x => ['.bin'].indexOf(x) === -1)
  .concat(['react-dom/server']) // TODO: This one shouldn't need special treatment.
  .forEach(mod => {
    nodeModules[mod] = 'commonjs2 ' + mod;
  });

// React/ES6 webpack loader configureation.
const loaders = [
  {
    test: /.jsx?$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    query: {
      presets: ['es2015', 'react']
    }
  },
  { test: /\.jsx?$/, loader: 'eslint-loader', exclude: /node_modules/ },
];

// Base webpack configuration.
const baseConfig = immutable.fromJS({
  module: { loaders: loaders },
  resolve: {
    root: relative('src/js'),
    extensions: ['', '.js', '.jsx'],
  }
});

// Client webpack configuration.
const clientConfig = baseConfig.merge(immutable.fromJS({
  entry: relative('src/js/app.js'),
  output: {
    path: relative('out/public/js'),
    filename: 'app.js',
  },
}));

// Server webpack configuration.
const serverConfig = baseConfig.merge(immutable.fromJS({
  entry: relative('src/js/server.js'),
  target: 'node',
  output: {
    path: relative('out'),
    filename: 'server.js',
    libraryTarget: "commonjs2",
  },
  externals: nodeModules,
  node: {
    __dirname: true,
    __filename: true,
  },
}));

// Webpack configuration for test bundle.
const testConfig = serverConfig
  .setIn(['output', 'filename'], 'test.js')
  .set('entry', relative('test/test.js'));

const webpackConfig = [clientConfig.toJS(), serverConfig.toJS()];

// Tasks to build and watch less files.
// TODO: replace gulp less build with webpack loaders.
gulp.task('less', () => (
  gulp.src(relative('src/less/style.less'))
    .pipe(less())
    .pipe(gulp.dest(relative('out/public/css')))
));
gulp.task('watch-less', ['less'], () => gulp.watch('style.less', ['less']));

function webpackCallback(done) {
  return (err, stats) => {
    if (err) {
      console.log('Error', err);
    } else {
      console.log(stats.toString());
    }
    if (done) done();
  }
}

// The task that builds all the assets.
gulp.task('build', ['less'], done => {
  webpack(webpackConfig).run(webpackCallback(done));
});

// Watch and trigger server restart on rebuild.
gulp.task('watch', ['watch-less'], () => {
  webpack(webpackConfig).watch(100, (err, stats) => {
    webpackCallback()(err, stats);
    nodemon.restart();
  });
});

// Start server and watch. Restart server on rebuild.
gulp.task('start', ['watch'], () => {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: relative('out/server.js'),
    ignore: ['*'],
    watch: ['foo/'],
    ext: 'noop'
  }).on('restart', function() {
    console.log('Server restarted.');
  });
});

// Build a test bundle and run tests.
gulp.task('test', [], done => {
  webpack(testConfig.toJS()).run(webpackCallback(() => {
    const mocha = new Mocha();
    mocha.addFile(relative('out/test.js'));
    mocha.run(done);
  }));
});

module.exports = gulp;
