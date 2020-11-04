const gulp = require('gulp');
const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
const csso = require('gulp-csso');
const include = require('gulp-file-include');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const sync = require('browser-sync').create();
const gulpinclude = require('gulp-include');

//Tasks
function html() {
    return src('src/**.html')
        .pipe(include({ prefix: '@@' }))
        .pipe(dest('dist'))
}

function scss() {
    return src('src/scss/**/**.scss')
        .pipe(sass())
        .pipe(autoprefixer({ Browserslist: ['last 2 versions'] }))
        .pipe(csso())
        .pipe(dest('dist/css'))
}

function fonts() {
    return src('src/fonts/**')
        .pipe(dest('dist/fonts'))
}

function images() {
    return src('src/images/**')
        .pipe(dest('dist/images'))
}

function js() {
    return src('src/js/**.js')
        .pipe(gulpinclude())
        .on('error', console.log)
        .pipe(gulp.dest('dist/js'))
}

function clear() {
    return del('dist')
}

function serve() {
    sync.init({ notify: false, server: './dist' })

    watch('src/**/**.html', series(html)).on('change', sync.reload)
    watch('src/scss/**/**.scss', series(scss)).on('change', sync.reload)
}

//Exports
exports.build = series(clear, fonts, js, images, scss, html);
exports.default = series(clear, fonts, js, images, scss, html, serve);
exports.clear = clear;