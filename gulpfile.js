var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
// var karma = require('gulp-karma');

// var testFiles = [
//   'src/js/main.js',
// ];

// gulp.task('test', function() {
//   // Be sure to return the stream
//   return gulp.src(testFiles)
//     .pipe(karma({
//       configFile: 'karma.conf.js',
//       action: 'run'
//     }))
//     .on('error', function(err) {
//       console.log(err);
//       // Make sure failed tests cause gulp to exit non-zero
//       throw err;
//     });
// });


// gulp.task('test', function (done) {
//   karma.start({
//     configFile: __dirname + '/karma.conf.js',
//     singleRun: true
//   }, done);
// });

gulp.task('lint', function () {
    // Note: To have the process exit with an error code (1) on
    //  lint error, return the stream and pipe to failOnError last.
    return gulp.src([
      'src/js/actions/**/*.js',
      'src/js/components/**/*.js',
      'src/js/config/**/*.js',
      'src/js/constants/**/*.js',
      'src/js/data/**/*.js',
      'src/js/mixins/**/*.js',
      'src/js/stores/**/*.js'
      ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('browserify', function() {
  gulp.src('src/js/main.js')
    .pipe(browserify({transform: 'reactify'}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('browserify-prod', function() {
  gulp.src('src/js/main.js')
    .pipe(browserify({transform: 'reactify'}))
    .pipe(concat('main.js'))
    .pipe(uglify({mangle:false}))
    .pipe(gulp.dest('production/js'));
});

gulp.task('copy', function() {
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
  gulp.src('src/assets/**/*.*')
    .pipe(gulp.dest('dist/assets'));
  gulp.src('public/**/*.*')
    .pipe(gulp.dest('dist/public'));
});

gulp.task('copy-prod', function() {
  gulp.src('src/index.html')
    .pipe(gulp.dest('production'));
  gulp.src('src/assets/**/*.*')
    .pipe(gulp.dest('production/assets'));
  gulp.src('public/**/*.*')
    .pipe(gulp.dest('production/public'));
  gulp.src('s3config/**/*.*')
    .pipe(gulp.dest('production'));
});

gulp.task('send-to-s3', shell.task([
  'cd production && s3-upload',
]))

gulp.task('default',['browserify', 'copy']);
gulp.task('production',['browserify-prod', 'copy-prod', 'send-to-s3']);

gulp.task('watch', function() {
  gulp.watch('src/**/*.*', ['default']);
});