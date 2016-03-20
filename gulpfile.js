'use strict';

// *****************
// ENV VARIABLES
// *****************
var isProc = (process.env.NODE_ENV === 'production');
var hasErrors = false;
var onWatch = false;

// *****************
// MODULES / UTILS
// *****************
var gulp = require('gulp');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babelify = require('babelify');
var del = require('del');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var notifier = require('node-notifier');
var concatCss = require('gulp-concat-css');
var addSrc = require('gulp-add-src');
var uglifyCss = require('gulp-uglifycss');
var uglifyJs = require('gulp-uglifyjs');
var gulpIf = require('gulp-if');
var runSequence = require('run-sequence');
var ngAnnotate = require('gulp-ng-annotate');
var stringify = require('stringify');
var browserifyCss = require('browserify-css')
var serve = require('gulp-serve');

// *****************
// HANDLERS
// *****************
var onError = function () {
  var args = Array.prototype.slice.call(arguments);
  hasErrors = true;
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  return this.emit('end');
}

var onSuccess = function () {
  onWatch = true;
  return notify({
    title: 'Build Success',
    message: 'Build Success',
    templateOptions: {
      date: new Date()
    }
  });
}

var bundle_logger = function () {
  startTime = null;
}


// *****************
// CONFIG
// *****************
var config = (function () {

  var src = 'src';
  var dest = 'build';

  var bowerDir  = './bower_components';
  var nodeDir   = './node_modules';
  var vendorDir = './vendor';

  var _config = {
    src: src,
    dest: dest,

    script: {
      src: [
        src
      ],
      entry: src + '/app.js',
      dest: dest + '/js',
      watchPath: [
        src + '/**/*.js'
      ]
    },

    style: {
      src: src + '/styles/**/*.scss',
      dest: dest + '/css',
      outputFile: 'style.css',
      watchPath: [
        src + '/**/*.scss',
      ],
      concatPath: [
        bowerDir + '/angular-tooltips/dist/angular-tooltips.css'
      ],
      loadPath: [
      ]
    },

    template: {
      src: src + '/templates/**/*.html',
      dest: dest + '/templates',
      watchPath: [
        src + '/**/*.html'
      ]
    }
  };

  return _config;
})();

// *****************
// TASKS
// *****************
gulp.task('task-done-notify', function () {
  if (! hasErrors) {
    notifier.notify({title: 'Build Sucess', message: 'Done' });
  }
});

// script
gulp.task('browserify', function () {
  var bundle, bundler, options;

  bundler = browserify({
    cache: {},
    packageCache: {},
    fullPaths: false,
    entries: [config.script.entry],
    extensions: ['.js', '.html'],
    debug: true
  });

  bundle = function () {
    // transform ES6 to ES5
    bundler.transform(
      babelify.configure({
        stage: 0,
        compact: false,
        only: config.src
      })
    )

    bundler.transform(
      stringify(['.html'])
    )

    bundler.transform(browserifyCss, {})

    bundler
      .bundle()
      .on('error', onError)
      .pipe(source('app.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(ngAnnotate())
      .pipe(gulpIf(isProc, uglifyJs()))
      .pipe(gulp.dest(config.script.dest))
      .pipe(browserSync.reload({stream: true}))
      .pipe(onSuccess());
  }

  return bundle();
});

// style
gulp.task('style', function () {
  return gulp.src(config.style.src)
    .pipe(sass().on('error', onError))
    .pipe(addSrc.prepend(config.style.concatPath))
    .pipe(concatCss(config.style.outputFile))
    .pipe(gulpIf(isProc, uglifyCss()))
    .pipe(gulp.dest(config.style.dest))
    .pipe(browserSync.reload({stream: true}))
    .pipe(onSuccess());
});

gulp.task('template', function () {
  return gulp.src(config.template.src)
    .on('error', onError)
    .pipe(gulp.dest(config.template.dest))
    .pipe(onSuccess());
});

// clean dest
gulp.task('clean', function () {
  return del([config.dest]);
});

gulp.task('serve', serve('./'));

gulp.task('watch', function () {
  gulp.watch(config.style.watchPath, ['style', browserSync.reload]);
  gulp.watch(config.script.watchPath, ['browserify', 'template', browserSync.reload]);
  gulp.watch(config.template.watchPath, ['browserify', 'template', browserSync.reload]);
  return gulp;
});

gulp.task('build', function (cb) {
  runSequence('clean', ['template', 'browserify', 'style'], cb);
});

gulp.task('default', function (cb) {
  runSequence('clean', ['template', 'browserify', 'style'], 'watch', 'task-done-notify', 'serve', cb);
});
