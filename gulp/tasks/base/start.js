var gulp        = require( 'gulp' );
var nodemon     = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var gutil = require ('gulp-util');

gulp.task('start', function () {
	if (!gutil.env.production) {
		livereload.listen();
	  nodemon({
	    script: 'app.js'
	  , ext: 'js html'
	  , env: { 'NODE_ENV': 'production' }
	  }).on('restart', function(){
			// when the app has restarted, run livereload.
			gulp.src('app.js')
				.pipe(livereload())
				.pipe(notify('Reloading page, please wait...'));
		})
	}
});