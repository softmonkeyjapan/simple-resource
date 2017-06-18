var gulp = require('gulp');
var KarmaServer = require('karma').Server;
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var mainBowerFiles = require('main-bower-files');

gulp.task('default', ['watch']);

gulp.task('js', function () {
  var files = [].concat(
    'lib/simple-paginator/simple-paginator.js',
    'lib/simple-resource/simple-resource.js',
    'lib/simple-resource/**/*.js'
  );

  return gulp.src(files)
    .pipe(ngAnnotate())
    .pipe(concat('simple-resource.js'))
    .pipe(gulp.dest('dist'))

    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['js']);

gulp.task('test', function (done) {
  return new KarmaServer({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done()).start();
});

gulp.task('watch', function () {
  gulp.watch('lib/**/*.js', ['dist', 'test']);
  gulp.watch('test/**/*-spec.js', ['test']);
});
