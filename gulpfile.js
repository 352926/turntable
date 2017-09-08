/**
 * User: dingding <352926@qq.com>
 * Date: 2017/8/30
 * Time: 16:37
 */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    del = require('del'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

//定义一个testLess任务（自定义任务名称）

gulp.task('clean', function (cb) {
    del(['dist'], cb)
});

gulp.task('css', function () {

    return gulp.src('src/turntable.css')
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));

});

gulp.task('script', function () {

    return gulp.src('src/turntable.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));

});

gulp.task('default', ['clean', 'css', 'script']);//定义默认任务
