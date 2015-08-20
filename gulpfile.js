// Include gulp
var gulp = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('js-watch', function() {
  browserSync.reload();
});

gulp.task('serve', function() {

  // Serve files from the root of this project
  browserSync.init({
    proxy: "localhost:3000"
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.watch("public/*.*", ['js-watch']);
});


// Default Task
gulp.task('default', ['serve']);
