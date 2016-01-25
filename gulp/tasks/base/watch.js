var gulp   = require( 'gulp' );
var path   = require( '../../paths.js' );
var gutil  = require( 'gulp-util');



gulp.task( 'watch', function(  )
{
	if (!gutil.env.production) {
		gulp.watch( path.to.jade.source, [ 'jade-client' ] );
		gulp.watch( path.to.sass.source, [ 'sass' ] );
		gulp.watch( path.to.scripts.source, [ 'scripts' ] );
		gulp.watch( path.to.images.source, [ 'images' ] );
	}
} );


gulp.task( 'angular-watch', function(  )
{
	if (!gutil.env.production) {
		gulp.watch( './src/**/*.jade', [ 'angular-jade' ] );
		gulp.watch( './src/**/*.scss', [ 'sass' ] );
		gulp.watch( './src/**/*.js', [ 'angular-scripts' ] );
		gulp.watch( './images/**/*.*', [ 'images' ] );
	}
} );