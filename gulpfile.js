var gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename');

var filesToMove = ['./src/client/js/*.*', './src/server/*.*'];

//собираем Jade
gulp.task('jade', function() {
    gulp.src('./src/client/client.jade')
        .pipe(jade())
        .pipe(rename({
            basename: "index"
        }))
        .pipe(gulp.dest('dest/client'));
});

// собираем Less
gulp.task('less', function() {
    gulp.src('./src/client/less/styles.less')
        .pipe(less())
        .pipe(csso())
        .pipe(rename({
            basename: "style",
            suffix: '.min',
            extname: ".css"
        }))
        .pipe(gulp.dest('dest/client/css'));
});

//перемещаем остальные файлы
gulp.task('move', function() {
    gulp.src(filesToMove, { base: './src' })
        .pipe(gulp.dest('dest/'));
});

gulp.task('build', function() {
    gulp.start('jade', 'less', 'move');
});