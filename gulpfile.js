var gulp        = require( 'gulp' );
var runSequence = require( 'run-sequence' );
var requireDir  = require( 'require-dir' );



// Require all tasks.
requireDir( './gulp/tasks', { recurse: true } );


// Commonly used tasks defined here.
gulp.task( 'default', function(  )
{
	runSequence(
		'clean',
		[
			'sass',
			'scripts',
			'images',
			'favicon', 
			'inject'
		],
		'watch',
		'start'
	);
} );



// Build task.
gulp.task( 'build', function(  )
{
	runSequence(
		'clean',
		[
			'build-images',
			'build-scripts',
			'build-css'
		],
		'build-html',
		'connect'
	);
} );
