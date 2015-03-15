"use strict";

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');
var wiredep = require('wiredep').stream;

var sync = require('browser-sync');
var reload = sync.reload;

/*
 * Utilities
 */

gulp.task('clean', function (cb) {
    del(['build/**/*', '!build/bower_components'], cb);
});

/*
 * Dependency Injection
 */

gulp.task('bower', ['markup'], function () {
    return gulp.src('./build/index.html')
        .pipe(wiredep())
        .pipe(gulp.dest('./build'));
});

/*
 * Styles
 */

gulp.task('styles', function () {
    return gulp.src('app/**/*.scss')
        .pipe(sass({
            sourcemap: true
        }))
        .pipe(gulp.dest('./build'))
        .pipe(reload({
            stream: true
        }));
});

/*
 * Markup
 */

gulp.task('markup', function () {
    return gulp.src('./app/*.html')
        .pipe(gulp.dest('./build'))
        .pipe(sync.reload({
            stream: true
        }));
});

/*
 * Development
 */

var bundler = watchify(browserify('./app/main.js', watchify.args));
gulp.task('serve', function () {
    
    bundler.on('update', bundle);
    bundler.on('log', gutil.log);
    
    sync({
        server: {
            baseDir: "./build"
        }
    });
    
});

gulp.task('default', ['scripts'], function () {
    gulp.watch('./app/**/*.scss', ['styles']);
    gulp.watch('./app/**/*.html', ['markup']);
});

gulp.task('scripts', ['serve'], bundle);
                      
gulp.task('bundle', bundle);

function bundle() {
    return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'))
        .pipe(reload({
            stream: true
        }));
}