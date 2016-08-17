var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
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

// Styles
gulp.task('styles', function () {
    return sass('src/styles/main.scss', {style: 'expanded'})
        .pipe(plumber())
        .pipe(autoprefixer('last 2 version'))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({message: 'Styles task complete'}));
});

gulp.task('style-maps', function () {
    return sass('src/styles/main.scss', {sourcemap: true})
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/assets/css'))
});

gulp.task('vendor-styles', function () {
    return gulp.src([
        'bower_components/foundation/css/normalize.css',
        'bower_components/foundation/css/foundation.css',
        'bower_components/fontawesome/css/font-awesome.css',
        'bower_components/jquery.terminal/css/jquery.terminal-0.10.12.min.css'
    ])
        .pipe(plumber())
        .pipe(autoprefixer('last 2 version'))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({message: 'Vendor Styles task complete'}));
});

gulp.task('vendor-style-maps', function () {
    return gulp.src(['bower_components/foundation/css/foundation.css.map',])
        .pipe(plumber())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(notify({message: 'Vendor Style Maps task complete'}));
});

// Scripts
gulp.task('scripts', function () {
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
});

// Vendor Scripts
gulp.task('vendor-scripts', function () {
    return gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/matchHeight/jquery.matchHeight.js',
        'bower_components/foundation/js/foundation.js',
        'bower_components/jquery.terminal/js/jquery.terminal-0.10.12.min.js',
        'bower_components/jquery.terminal/js/jquery.mousewheel-min.js',
    ])
        .pipe(plumber())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({message: 'Vendor Scripts task complete'}));
});


// Images
gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(plumber())
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({message: 'Images task complete'}));
});

// Fonts
gulp.task('fonts', function () {
    return gulp.src('bower_components/fontawesome/fonts/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist/assets/fonts'))
        .pipe(notify({message: 'Font task complete'}));
});


// Clean
gulp.task('clean', function () {
    return del(['dist/assets']);
});

// Default task
gulp.task('default', ['all-styles', 'all-scripts', 'watch']);

gulp.task('all-styles', ['clean'], function () {
    gulp.start('styles', 'style-maps', 'vendor-styles', 'vendor-style-maps', 'images', 'fonts');
});

gulp.task('all-scripts', ['clean'], function () {
    gulp.start('scripts', 'vendor-scripts');
});

// Watch
gulp.task('watch', function () {

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

});
