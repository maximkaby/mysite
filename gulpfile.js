var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var gulpIf = require('gulp-if');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglifyjs');

var config = {
    paths: {
        scss: [
                './app/scss/**/*.scss',
            ],
        html: './app/index.html',
        js: './app/js/**/*.js'
    },
    output: {
        cssName: 'bundle.min.css',
        path: './app'
    },
    isDevelop: true
};

gulp.task('scss', function () {
    return gulp.src(config.paths.scss)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(sass())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer())
        .pipe(gulpIf(!config.isDevelop, cleanCss()))
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
        .pipe(gulp.dest(config.output.path))
        .pipe(browserSync.stream());
});

gulp.task('libs-css', function() {
    return gulp.src([
            'node_modules/swiper/dist/css/swiper.css',
            'node_modules/bootstrap/dist/css/bootstrap.css',
        ])
    .pipe(concat('libs.min.css'))
    .pipe(gulp.dest('app/css'));
});

gulp.task('scripts', function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/swiper/dist/js/swiper.js',
            'node_modules/popper.js/dist/umd/popper.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
        ])
        .pipe(concat('libs.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});



gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: config.output.path
        },
        notify: false
    });

    gulp.watch(config.paths.scss, ['scss']);
    gulp.watch(config.paths.js).on('change', browserSync.reload);
    gulp.watch(config.paths.html).on('change', browserSync.reload);
});

gulp.task('default', ['scss', 'serve']);
