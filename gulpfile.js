var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

var jsVendorSrc = [
    'js/vendor/jquery-1.10.2.min.js',
    'js/vendor/bootstrap/bootstrap.min.js',
    'js/vendor/angular/angular.min.js',
    'js/vendor/underscore-min.js'
];
var jsDevSrc = [
    'js/dev/services/services.js',
    'js/dev/services/**.js',
    'js/dev/filters/**.js',
    'js/dev/directives/**.js',
    'js/dev/controllers/main.js',
    'js/dev/controllers/**/*.js',
];


gulp.task('scripts_vendor', function() {
    return gulp.src(jsVendorSrc)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('js'));
});
gulp.task('scripts_dev', function() {
    return gulp.src(jsDevSrc)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));
});
gulp.task('default', ['scripts_vendor','scripts_dev'], function(){});