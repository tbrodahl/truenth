'use strict';

var gutils = require('gulp-util'),
gulp = require('gulp'),
path = require('path'),
mergeStream = require('merge-stream'),
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
  var fonts = gulp.src('./src/assets/fonts/**')
  .pipe(gulp.dest('./dist/fonts'));
  var jQuery = gulp.src('./src/assets/components/jquery/dist/jquery.min.js')
  .pipe(gulp.dest('./dist/scripts'));

  return mergeStream(fonts, jQuery);
});


gulp.task('concat', function () {
  return gulp.src(tasks.concat.src)
  .pipe($.concat('vendor.js'))
  .pipe($.if(production, $.uglify()))
  .on('error', handleErrors)
  .pipe($.if(production, $.rename('vendor.min.js')))
  .pipe(gulp.dest(tasks.concat.dest));
});

gulp.task('images', function () {
  return gulp.src(tasks.images.src)
  // .pipe($.imagemin())
  .on('error', handleErrors)
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

gulp.task('coffee', function () {
  return gulp.src(tasks.coffee.src, {read: false})
  .pipe($.browserify({
    transform: ['coffeeify'], extensions: ['.coffee']
  }))
  .on('error', handleErrors)
  .pipe($.concat('app.js'))
  .pipe($.if(production, $.uglify()))
  .pipe(gulp.dest(tasks.coffee.dest))
});


gulp.task('cssnano', ['sass'], function () {
  return gulp.src(tasks.cssnano.main)
  .pipe($.cssnano())
  .pipe($.rename('app.min.css'))
  .pipe(gulp.dest(tasks.cssnano.dest));
});

// gulp.task('iconfont', function(){
//   gulp.src(['./src/assets/iconsvg/*.svg'], { base: './src/assets' })
//   .pipe($.iconfontCss({
//     fontName: 'custom-icons',
//     path: './src/assets/iconsvg/template.scss',
//     targetPath: '../../../src/assets/iconsvg/_icons.scss',
//     fontPath: '/fonts/icons/'
//   }))
//   .pipe($.iconfont({
//     fontName: 'custom-icons'
//   }))
//   .pipe(gulp.dest('./dist/fonts/icons'));
// });

gulp.task('svgstore', function () {
  var svgs = gulp
  .src(tasks.svgstore.src)
  .pipe($.svgmin(function (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: {
          prefix: prefix + '-',
          minify: true
        }
      }]
    }
  }))
  .pipe($.svgstore({ inlineSvg: true }));

  function fileContents (filePath, file) {
    return file.contents.toString();
  }

  return gulp
  .src(tasks.svgstore.pugSrc)
  .pipe($.inject(svgs, { transform: fileContents }))
  .pipe(gulp.dest(tasks.svgstore.dest));
});

gulp.task('watch', [], function () {
  $.watch(tasks.images.src, function () {
    runSequence(['images']);
  });
  $.watch(tasks.sass.src, function () {
    runSequence(['sass']);
  });
  $.watch(tasks.svgstore.src, function () {
    runSequence(['svgstore', 'pug']);
  });
  $.watch(tasks.pug.watch, function () {
    runSequence(['pug']);
  });
  $.watch(tasks.coffee.watch, function () {
    runSequence(['coffee']);
  });
  browserSync(tasks.browserSync);
});

var buildTasks = [
  'copy',
  'images',
  'svgstore',
  'pug',
  'sass',
  'coffee',
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

var publisher = $.awspublish.create({
  profile: 'default',
  params: {
    Bucket: 'truenth'
  }
});

var headers = {
  'Cache-Control': 'max-age=0, no-transform, public'
};

gulp.task('publish', function() {
  return gulp.src('./dist/**')
  .pipe(publisher.publish(headers))
  .on('error', function(err) {
    return console.error('failed to publish err code: ', err.statusCode, 'error:', err);
  })
  .pipe(publisher.sync())
  .pipe(publisher.cache())
  .pipe($.awspublish.reporter({
    states: ['create', 'update', 'delete']
  }))
  .pipe($.notify('files published'));
});

gulp.task('default', ['build', 'watch']);
