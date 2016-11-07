'use strict';

const gutils = require('gulp-util'),
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

const handleErrors = function() {
  const args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  $.notify.onError({
    message: '<%= error %>',
    title: 'Compile Error'
  })
  .apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
}

gulp.task('clean', () => {
  return del(tasks.clean.src);
});

gulp.task('copy', ['symbols'], () => {
  const fonts = gulp.src('./src/assets/fonts/**')
  .pipe(gulp.dest('./dist/fonts'));
  const symbols = gulp.src('./src/assets/font-kit/dist/fonts/**')
  .pipe(gulp.dest('./dist/fonts'));
  const jQuery = gulp.src('./src/assets/components/jquery/dist/jquery.min.js')
  .pipe(gulp.dest('./dist/scripts'));

  return mergeStream(fonts, symbols, jQuery);
});


gulp.task('concat', ['modernizr'], () => {
  return gulp.src(tasks.concat.src)
  .pipe($.concat('vendor.js'))
  .pipe($.if(production, $.uglify()))
  .on('error', handleErrors)
  .pipe($.if(production, $.rename('vendor.min.js')))
  .pipe(gulp.dest(tasks.concat.dest));
});

gulp.task('images', () => {
  return gulp.src(tasks.images.src)
  .pipe($.imagemin())
  .on('error', handleErrors)
  .pipe(gulp.dest(tasks.images.dest));
});

gulp.task('sass', ['symbols'], () => {

  const autoprefixer = require('autoprefixer');

  return gulp.src(tasks.sass.main)
  .pipe($.sourcemaps.init())
  .pipe($.sass({
    includePaths: [
      './src/assets/components',
      './src/assets/styles',
      './src/assets/font-kit/dist/scss'
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


/**
 * Font settings
 */
const
  // set name of your symbol font
  fontName = 'symbols',
  // set class name in your CSS
  className = 's',
  // you can also choose 'foundation-style'
  template = 'fontawesome-style',
  // you can also choose 'symbol-font-16px.sketch'
  sketchFileName = './src/assets/font-kit/symbol-font-16px.sketch'

/**
 * Recommended to get consistent builds when watching files
 * See https://github.com/nfroidure/gulp-iconfont
 */
const timestamp = Math.round(Date.now() / 1000)

gulp.task('symbols', () =>
  gulp.src(sketchFileName)
    .pipe($.sketch({
      export: 'artboards',
      formats: 'svg'
    }))
    .pipe($.iconfont({
      fontName,
      formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
      timestamp,
      log: () => {} // suppress unnecessary logging
    }))
    .on('glyphs', (glyphs) => {
      const options = {
        className,
        fontName,
        fontPath: '../fonts/', // set path to font (from your CSS file if relative)
        glyphs: glyphs.map(mapGlyphs)
      }
      gulp.src(`./src/assets/font-kit/templates/${ template }.css`)
        .pipe($.consolidate('lodash', options))
        .pipe($.rename({ basename: fontName }))
        .pipe(gulp.dest('./src/assets/font-kit/dist/css'))
        .pipe($.rename('symbols.scss'))
        .pipe(gulp.dest('./src/assets/font-kit/dist/scss'))
        // set path to export your scss

      // if you don't need sample.html, remove next 4 lines
      gulp.src(`./src/assets/font-kit/templates/${ template }.html`)
        .pipe($.consolidate('lodash', options))
        .pipe($.rename({ basename: 'sample' }))
        .pipe(gulp.dest('./src/assets/font-kit/dist/')) // set path to export your sample HTML
    })
    .pipe(gulp.dest('./src/assets/font-kit/dist/fonts')) // set path to export your fonts
)

const mapGlyphs = (glyph) => {
  return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}

gulp.task('pug', () => {
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

gulp.task('coffee', () => {
  return gulp.src(tasks.coffee.src, {read: false})
  .pipe($.browserify({
    transform: ['coffeeify'], extensions: ['.coffee']
  }))
  .on('error', handleErrors)
  .pipe($.concat('app.js'))
  .pipe($.if(production, $.uglify()))
  .pipe(gulp.dest(tasks.coffee.dest))
});

gulp.task('modernizr', ['sass'], () => {
  return gulp.src(tasks.modernizr.src)
  .pipe($.modernizr('modernizr-custom.js', tasks.modernizr.settings))
  .pipe(gulp.dest(tasks.modernizr.dest));
});

gulp.task('cssnano', ['sass'], () => {
  return gulp.src(tasks.cssnano.main)
  .pipe($.cssnano())
  .pipe($.rename('app.min.css'))
  .pipe(gulp.dest(tasks.cssnano.dest));
});

gulp.task('svgstore', () => {
  const svgs = gulp
  .src(tasks.svgstore.src)
  .pipe($.svgmin((file) => {
    const prefix = path.basename(file.relative, path.extname(file.relative));
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

  const fileContents = (filePath, file) => {
    return file.contents.toString();
  }

  return gulp
  .src(tasks.svgstore.pugSrc)
  .pipe($.inject(svgs, { transform: fileContents }))
  .pipe(gulp.dest(tasks.svgstore.dest));
});

gulp.task('watch', [], () => {
  $.watch(tasks.images.src, () => {
    runSequence(['images']);
  });
  $.watch(tasks.sass.src, () => {
    runSequence(['sass']);
  });
  $.watch(tasks.svgstore.src, () => {
    runSequence(['svgstore', 'pug']);
  });
  $.watch(tasks.pug.watch, () => {
    runSequence(['pug']);
  });
  $.watch(tasks.coffee.watch, () => {
    runSequence(['coffee']);
  });
  browserSync(tasks.browserSync);
});

const buildTasks = [
  'copy',
  'concat',
  'images',
  'svgstore',
  'pug',
  'sass',
  'coffee',
  'cssnano',
  'modernizr',
  'symbols'
];

if (production) {
  buildTasks.push('uglify');
}

gulp.task('build', () => {
  return runSequence(
    ['clean'], buildTasks
  );
});

const publisher = $.awspublish.create({
  profile: 'default',
  params: {
    Bucket: 'truenth'
  }
});

const headers = {
  'Cache-Control': 'max-age=0, no-transform, public'
};

gulp.task('publish', () => {
  return gulp.src('./dist/**')
  .pipe(publisher.publish(headers))
  .on('error', (err) => {
    return console.error('failed to publish err code: ', err.statusCode, 'error:', err);
  })
  .pipe(publisher.sync())
  .pipe(publisher.cache())
  .pipe($.awspublish.reporter({
    states: ['create', 'update', 'delete']
  }));
  // .pipe($.notify('files published'));
});

gulp.task('default', ['build', 'watch']);
