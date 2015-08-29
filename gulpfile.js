var gulp            = require('gulp');
var sass            = require('gulp-sass');
var browserSync     = require('browser-sync').create();
var reload          = browserSync.reload;
var prefix          = require('gulp-autoprefixer');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var rename          = require('gulp-rename');
var minifyCSS       = require('gulp-minify-css');
var postcss         = require('gulp-postcss');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('autoprefixer');
var lost            = require('lost');
var browserify      = require('browserify');
var source          = require('vinyl-source-stream');
var buffer          = require('vinyl-buffer');

var paths = {

  root: './',
  index: './index.html',

  src: {
    scss: './src/scss/*.scss',
    scssFiles: './src/scss/**/**/*.scss',
    js: './src/js/index.js',
    jsFiles: './src/js/*.js'
  },

  dist: {
    css: './dist/css',
    js: './dist/js',
    html: './dist/**/*.html',
  }

};

// Static Server + watching scss/html files
gulp.task('serve', ['scss', 'browserify'], function() {

  browserSync.init({
    server: paths.root
  });

  gulp.watch(paths.src.scssFiles, ['scss']);
  gulp.watch(paths.src.jsFiles, ['browserify']);
  gulp.watch(paths.src.jsFiles).on('change', reload);
  gulp.watch(paths.dist.html).on('change', reload);
  gulp.watch(paths.index).on('change', reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('scss', function() {
  return gulp.src(paths.src.scss)
    .pipe(sass({
      onError: browserSync.notify,
        errLogToConsole: true
    }).on('error', handleError))
    .pipe(sourcemaps.init())
    .pipe(postcss([
      lost(),
      autoprefixer()
    ]))
    .pipe(sourcemaps.write(paths.src.scss))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.dist.css))
    .pipe(browserSync.stream());
});

gulp.task('browserify', function() {
  // Grabs the app.js file
  return browserify(paths.src.js)
    // bundles it and creates a file called bundle.js
    .bundle()
    .on('error', function(err){
      console.log(err);
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    // .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js));
});

// Handle errors and continue watching files
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('default', ['serve']);