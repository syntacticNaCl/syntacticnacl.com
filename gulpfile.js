var gulp = require('gulp'),
    sass = require('gulp-sass'),
// adds prefixes for vendors for caniuse.com
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    plumber = require('gulp-plumber');

sass.compiler = require('node-sass');

// Styles
function styles() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({message: 'Styles task complete'}));
}

function styleMaps() {
  return gulp.src('src/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/assets/css'));
}

function vendorStyles() {
  return gulp.src([
    'bower_components/foundation/css/normalize.css',
    'bower_components/foundation/css/foundation.css',
    'bower_components/fontawesome/css/font-awesome.css',
    'bower_components/jquery.terminal/css/jquery.terminal.css',
  ])
    .pipe(plumber())
    .pipe(autoprefixer('last 2 version'))
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({message: 'Vendor Styles task complete'}));
}

function vendorStyleMaps() {
  return gulp.src(['bower_components/foundation/css/foundation.css.map',])
    .pipe(plumber())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(notify({message: 'Vendor Style Maps task complete'}));
}

// Scripts
function scripts() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({message: 'Scripts task complete'}));
}

// Vendor Scripts
function vendorScripts() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/matchHeight/jquery.matchHeight.js',
    'bower_components/foundation/js/foundation.js',
    'bower_components/jquery.terminal/js/jquery.terminal.min.js',
    'bower_components/jquery.terminal/js/jquery.mousewheel-min.js',
  ])
    .pipe(plumber())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({message: 'Vendor Scripts task complete'}));
}

// Clean
function clean() {
  return del(['dist/assets']);
}

// Watch
function watch() {
  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', gulp.series(styles));

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', gulp.series(scripts));
}

exports.default = gulp.series(clean, gulp.parallel(styles, styleMaps, vendorStyles, vendorStyleMaps, scripts, vendorScripts), watch)
