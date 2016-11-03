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
      src: './dist'
    },
    cssnano: {
      main: './dist/styles/app.css',
      dest: './dist/styles'
    },
    images: {
      src: [
        '!./src/assets/images/sprite.png', '!./src/assets/images/sprite/**/*', './src/assets/images/*', './src/assets/images/**/*'
      ],
      watch: ['./src/assets/images/**'],
      dest: './dist/images'
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
