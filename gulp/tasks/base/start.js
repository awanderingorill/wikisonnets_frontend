var gulp        = require( 'gulp' );
var nodemon     = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');

gulp.task('start', function () {
	livereload.listen();
  nodemon({
    script: 'app.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  }).on('restart', function(){
		// when the app has restarted, run livereload.
		gulp.src('app.js')
			.pipe(livereload())
			.pipe(notify('Reloading page, please wait...'));
	})
})