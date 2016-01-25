var gulp    = require( 'gulp' );
var flatten = require( 'gulp-flatten' );
var connect = require( 'gulp-connect' );
var jade    = require( 'gulp-jade' );
var templatizer = require( 'templatizer' );
var cache   = require( 'gulp-cached' );

var path    = require( '../../paths.js' );
var error   = require( '../../error-handler.js' );



// Compile Jade pages, flatten the path,
// then put the files in the build folder.

gulp.task( 'jade', function(  )
{
	return gulp.src( path.to.jade.pages )
		.pipe( jade(  ) )
		.on( 'error', error.handler )
		.pipe( flatten(  ) )
		.pipe( gulp.dest( path.to.jade.destination ) )
		.pipe( connect.reload(  ) );
} );

gulp.task( 'jade-client', function() {
	templatizer('./site/client-templates', 
							'./site/scripts/templates.js', 
							{ jade : { doctype: 'html' } })
});

gulp.task( 'angular-jade', function( )
{
	return gulp.src( './src/**/*.jade' )
		.pipe( cache( 'jade' ) )
		.pipe( jade( { pretty: true } ) )
		.on( 'error', error.handler )
		.pipe( gulp.dest( './dist' ) );
} );
