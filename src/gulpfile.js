'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const del = require('del');
const tingpng = require('gulp-tinypng');
const browserSync = require('browser-sync').create();

const imgFiles = [
    'img/*'
];

const pugFiles = [
    './pug/**/*.pug'
];

const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './node_modules/bootstrap/dist/css/bootstrap-grid.min.css',
    './sass/fonts.sass',
    './sass/main.sass',
    './sass/media.sass'
];

const jsFiles = [
    './js/*.js'
];

function images() {
    return gulp.src(imgFiles)
                .pipe(tingpng('ZSM6NVGdsdRpLy8H13qktR1bMFDEUdeG'))
                .pipe(gulp.dest('./../build/img'));
}

function html() {
    return gulp.src(pugFiles)
                .pipe(pug({
                    // Your options in here.
                  }))
                .pipe(gulp.dest('./../build'));
}

function styles() {
    return gulp.src(cssFiles)
                .pipe(sass().on('error', sass.logError))
                .pipe(concat('main.css'))
                .pipe(autoprefixer())
                .pipe(cleanCSS({level: 2}))
                .pipe(gulp.dest('./../build/css'))
                .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(jsFiles)
                .pipe(concat('main.js'))
                .pipe(uglify({
                    toplevel: true
                }))
                .pipe(gulp.dest('./../build/js'))
                .pipe(browserSync.stream());
}

function clean() {
    return del(['./build/*'], {force: true});
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./../build"
        },
        // tunel: true
    });
    gulp.watch('./pug/*.pug', html);
    gulp.watch('./sass/*.sass', styles);
    gulp.watch('./js/**/*.js', scripts);
    gulp.watch("./../build/*.html").on('change', browserSync.reload);
}

gulp.task('images', images);
gulp.task('html', html);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('clean', clean);

gulp.task('build',
            gulp.series(clean, 
            gulp.parallel(html, styles))
        );

gulp.task('dev', gulp.series('build', 'watch'));
