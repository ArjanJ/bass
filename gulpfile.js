var gulp            = require('gulp');
var sass            = require('gulp-sass');
var browserSync     = require('browser-sync').create();
var reload          = browserSync.reload;
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
var jshint          = require('gulp-jshint');

var paths = {

	root: './',
	index: './index.html',

	src: {
		scss: './src/scss/**/**/*.scss',
		js: './src/js/*.js',
		jsIndex: './src/js/index.js'
	},

	dist: {
		css: './dist/css',
		js: './dist/js',
		bundle: './dist/js/bundle.js'
	}

};

// Static Server + watching scss/html files
gulp.task('serve', ['scss', 'browserify'], function() {

	browserSync.init({
		server: paths.root
	});

	gulp.watch(paths.src.scss, ['scss']);
	gulp.watch(paths.src.js, ['lint', 'browserify']);
	gulp.watch(paths.index).on('change', reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('scss', function() {
	return gulp.src(paths.src.scss)
		.pipe(sourcemaps.init())
		.pipe(sass({
			onError: browserSync.notify,
				errLogToConsole: true
		}).on('error', handleError))
		.pipe(postcss([
			lost(),
			autoprefixer()
		]))
		.pipe(minifyCSS())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.dist.css))
		.pipe(browserSync.stream());
});

gulp.task('browserify', function() {
	return browserify(paths.src.jsIndex)
		.bundle()
		.on('error', function(err){
			console.log(err.data);
			this.emit('end');
		})
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(gulp.dest(paths.dist.js))
		.pipe(browserSync.stream());
});

gulp.task('uglify', function() {
	return gulp.src(paths.dist.bundle)
		.pipe(uglify())
		.pipe(gulp.dest(paths.dist.js));
});

gulp.task('lint', function() {
	return gulp.src(paths.src.js)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', ['scss', 'lint', 'browserify']);

// Handle errors and continue watching files
function handleError(err) {
	console.log(err.toString());
	this.emit('end');
}

gulp.task('default', ['serve']);