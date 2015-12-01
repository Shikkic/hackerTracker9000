var gulp = require('gulp'),
    exec = require('child_process').exec,
    gutil = require('gulp-util');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('build', function(cb) {
    exec('git update-index --assume-unchanged ./.env', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        gutil.log(gutil.colors.green(".env will now be ignored locally."), gutil.colors.red("NEVER COMMIT YOUR .ENV PUBLICLY!"));
        cb(err);
    }); 
});

gulp.task('run', function(cb) {
    gutil.log(gutil.colors.magenta("Running hackerTracker9000"));
    var child = exec('node index.js');
    child.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });
    child.stderr.on('data', function(data) {
        console.log('stdout: ' + data);
    });
    child.on('close', function(code) {
        console.log('closing code: ' + code);
    });
});
