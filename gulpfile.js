"use strict";

var browserify = require('browserify');
var del = require('del');
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var wiredep = require('wiredep').stream;

gulp.task('clean', function (cb) {
    del(['build/*.js', 'build/*.css', 'build/*.html'], cb);
});

gulp.task('scripts', ['clean'], function () {
    var browserified = transform(function (filename) {
        var b = browserify({
            entries: filename,
            debug: true
        });
        return b.bundle();
    });
    return gulp.src('./app/main.js')
        .pipe(browserified)
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'));
});

gulp.task('styles', ['clean'], function () {
    return gulp.src('./app/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build'));
});

gulp.task('markup', ['clean'], function () {
    return gulp.src('./app/*.html')
        .pipe(gulp.dest('./build'));
});

gulp.task('bower', ['markup'], function () {
    return gulp.src('./build/index.html')
        .pipe(wiredep())
        .pipe(gulp.dest('./build'));
});

gulp.task('default', [
    'scripts',
    'styles',
    'bower'
]);