var gulp   = require( 'gulp' );
var path   = require( '../../paths.js' );
var gutil  = require( 'gulp-util');



gulp.task( 'watch', function(  )
{
	if (!gutil.env.production) {
		//gulp.watch( path.to.jade.source, [ 'jade' ] );
		gulp.watch( path.to.sass.source, [ 'sass' ] );
		gulp.watch( path.to.scripts.source, [ 'scripts' ] );
		gulp.watch( path.to.images.source, [ 'images' ] );
	}
} );
