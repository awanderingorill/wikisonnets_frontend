var gulp      = require( 'gulp' );
var gutil     = require( 'gulp-util' );

var connect   = require( 'gulp-connect' );
var cache     = require( 'gulp-cached' );

var eslint    = require( 'gulp-eslint' );

var path      = require( '../../paths.js' );

var mainBowerFiles = require('main-bower-files');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


// Scripts.

gulp.task( 'bower', function( ) {
	console.log(mainBowerFiles({ base: 'bower_components', includeDev: true }));
	return gulp.src(mainBowerFiles({ base: 'bower_components', includeDev:true }))
        .pipe(gulp.dest( path.to.scripts.lib_destination ))
});

gulp.task( 'browserify', function() {
	var b = browserify({
    entries: './site/scripts/script.js',
    debug: true
  });

  return b.bundle()
  	.pipe(source('main.js'))
  	.pipe(buffer())
  	.pipe(gulp.dest('build/scripts/'));
});

gulp.task( 'eslint', function(  )
{
	return gulp.src( path.to.scripts.source )
		.pipe( eslint(  ) )
		.pipe( eslint.format(  ) );
} );

gulp.task( 'scripts', [ 'bower', 'browserify', 'eslint' ], function(  )
{
	return gulp.src( path.to.scripts.source )
		.pipe( gulp.dest( path.to.scripts.destination ) )
		.pipe( connect.reload(  ) );
} );

