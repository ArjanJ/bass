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

var paths = {
  root: './',
  scss: './src/scss/*.scss',
  scssAll: './src/scss/**/**/*.scss',
  css: './dist/css/',
  js: './src/js/',
  html: './*.html'
};

// Static Server + watching scss/html files
gulp.task('serve', ['scss'], function() {

  browserSync.init({
    server: paths.root
  });

  gulp.watch(paths.scssAll, ['scss']);
  gulp.watch(paths.html).on('change', reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('scss', function() {
  return gulp.src(paths.scss)
    .pipe(sass({
      onError: browserSync.notify,
        errLogToConsole: true
    }).on('error', handleError))
    .pipe(sourcemaps.init())
    .pipe(postcss([
      lost(),
      autoprefixer()
    ]))
    .pipe(sourcemaps.write('./'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
});

// Handle errors and continue watching files
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('default', ['serve']);