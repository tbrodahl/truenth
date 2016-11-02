'use strict';

var gutils = require('gulp-util'),
gulp = require('gulp'),
production = gutils.env.production || process.env.NODE_ENV === 'production',
config = require('./config'),
tasks = config.tasks,
$ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
}),
browserSync = require('browser-sync'),
del = require('del'),
runSequence = require('run-sequence'),
environmentName = production ? gutils.colors.red('PRODUCTION') : gutils.colors.red('DEVELOPMENT');

gutils.log('Starting Gulp for', environmentName, 'environment...');

if (production) {
  process.env.NODE_ENV = 'production';
}

var handleErrors = function () {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  $.notify.onError({
    message: '<%= error %>',
    title: 'Compile Error'
  })
  .apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};

gulp.task('clean', function () {
  return del([tasks.clean.src]);
});

gulp.task('copy', function() {
  return gulp.src('./src/assets/fonts/**')
  .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('images', function () {
  return gulp.src(tasks.images.src)
  .pipe(gulp.dest(tasks.images.dest));
});

gulp.task('sass', function () {

  var autoprefixer = require('autoprefixer');

  return gulp.src(tasks.sass.main)
  .pipe($.sourcemaps.init())
  .pipe($.sass({
    includePaths: [
      './src/assets/components',
      './src/assets/styles'
    ]
  }))
  .on('error', handleErrors)
  .pipe($.postcss([
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ]))
  .pipe($.sourcemaps.write('./'))
  .pipe(gulp.dest(tasks.sass.dest))
  .pipe(browserSync.reload({
    match: '**/*.css',
    stream: true
  }));
});

gulp.task('pug', function () {
  return gulp.src(tasks.pug.src)
  .pipe($.pug({
    locals: config,
    pretty: true
  }))
  .on('error', handleErrors)
  .pipe(gulp.dest(tasks.dest))
  .pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('cssnano', ['sass'], function () {
  return gulp.src(tasks.cssnano.main)
  .pipe($.cssnano())
  .pipe($.rename('app.min.css'))
  .pipe(gulp.dest(tasks.cssnano.dest));
});

gulp.task('watch', function () {
  $.watch(tasks.sass.src, function () {
    runSequence(['sass']);
  });
  $.watch(tasks.pug.watch, function () {
    runSequence(['pug']);
  });
  browserSync(tasks.browserSync);
});

var buildTasks = [
  'copy',
  'images',
  'pug',
  'sass',
  'cssnano'
];

if (production) {
  buildTasks.push('uglify');
}

gulp.task('build', function () {
  return runSequence(
    ['clean'], buildTasks
  );
});

gulp.task('default', ['build', 'watch']);
