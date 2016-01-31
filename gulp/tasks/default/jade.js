var gulp    = require( 'gulp' );
var jade    = require( 'gulp-jade' );
var cache   = require( 'gulp-cached' );

var path    = require( '../../paths.js' );
var error   = require( '../../error-handler.js' );



gulp.task( 'jade', function( )
{
	return gulp.src( path.to.jade.pages )
		.pipe( cache( 'jade' ) )
		.pipe( jade( { pretty: true } ) )
		.on( 'error', error.handler )
		.pipe( gulp.dest( path.to.jade.destination ) );
} );
