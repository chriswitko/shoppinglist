var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
// var jqc = require('gulp-jquery-closure');

gulp.task('browserify', function() {
  gulp.src('src/js/main.js')
    // .pipe(browserify({
    //     shim: {
    //         jQuery: {
    //             path: 'public/js/jquery.min.js',
    //             exports: '$'
    //         }
    //     }
    // }))
    .pipe(browserify({transform: 'reactify'}))
    .pipe(concat('main.js'))
    // .pipe(uglify({mangle:false}))
    // .pipe(jqc({$: false, window: true, document: true}))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function() {
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
  gulp.src('src/assets/**/*.*')
    .pipe(gulp.dest('dist/assets'));
  gulp.src('public/**/*.*')
    .pipe(gulp.dest('dist/public'));
});

gulp.task('default',['browserify', 'copy']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.*', ['default']);
});