var gulp = require('gulp');
var karma = require('karma').server;
var babel = require('gulp-babel');
var rename = require('gulp-rename');



gulp.task('default', function() {
  gulp.src('src/yepnope.es6')
  .pipe(babel())
  .pipe(rename('yepnope.js'))
  .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
  gulp.watch('src/yepnope.es6', ['default']);
});


gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});
