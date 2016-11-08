module.exports = {
  sourcemaps: true,
  baseTitle: 'Static',
  tasks: {
    dest: './dist',
    browserSync: {
      open: false,
      notify: {
        styles: {
          top: 'auto',
          bottom: 0
        }
      },
      server: {
        baseDir: './dist'
      }
    },
    clean: {
      src: ['./dist', './src/assets/font-kit/dist']
    },
    coffee: {
      src: './src/assets/scripts/index.coffee',
      dest: './dist/scripts',
      watch: [
        './src/assets/scripts/*.{coffee}',
        './src/assets/scripts/**/*.{coffee}'
      ],
    },
    concat: {
      src: [
        './src/assets/scripts/lib/modernizr-custom.js',
        './src/assets/components/easing/easing.js',
        './src/assets/components/bootstrap/js/dist/util.js',
        './src/assets/components/bootstrap/js/dist/dropdown.js',
        './src/assets/components/lodash/dist/lodash.js',
        './src/assets/components/imagesloaded/imagesloaded.pkgd.js'
      ],
      dest: './dist/scripts'
    },
    cssnano: {
      main: './dist/styles/app.css',
      dest: './dist/styles'
    },
    images: {
      src: [
        '!./src/assets/images/sprite.png', '!./src/assets/images/sprite/**/*', './src/assets/images/**'
      ],
      watch: ['./src/assets/images/**'],
      dest: './dist/images'
    },
    modernizr: {
      settings: {
        options: [
          'setClasses',
          'addTest',
          'html5printshiv',
          'testProp',
          'fnBind'
        ],
        tests: ['touchevents', 'pointerevents', 'forcetouch']
      },
      src: [
        'scripts/*.js',
        './src/assets/styles/**/*.{sass,scss}',
        './src/assets/styles/*.{sass,scss}'
      ],
      dest: './src/assets/scripts/lib'
    },
    pug: {
      src: ['./src/content/**/*.pug'],
      watch: ['./src/**/*.pug']
    },
    sass: {
      main: './src/assets/styles/app.sass',
      src: [
        '!./src/assets/styles/lib/sprites/*', '!./src/assets/styles/lib/iconFont/*', '!./src/assets/styles/lib/svg/*', '!./src/assets/styles/lib/_svg.{sass,scss}', './src/assets/styles/**/*.{sass,scss}'
      ],
      dest: './dist/styles'
    },
    svgstore: {
      src: './src/assets/iconsvg/*.svg',
      dest: './src/templates/partial',
      pugSrc: './src/assets/iconsvg/_inline-svg.pug'
    }
  }
};
