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
var uglify = require('gulp-uglify');


// Scripts.

gulp.task( 'bower', function( ) {
	console.log(mainBowerFiles({ base: 'bower_components', includeDev: true }));
	return gulp.src(mainBowerFiles({ base: 'bower_components', includeDev:true }))
        .pipe(gulp.dest( path.to.scripts.lib_destination ))
});

var libs = [
	path.to.scripts.lib_destination + '/jquery.js',
	path.to.scripts.lib_destination + '/jquery-ui.js'
];
gulp.task( 'vendor', function() {
	var b = browserify({
    entries: libs,
    debug: true
  });

  return b.bundle()
  	.pipe(source('vendor.js'))
  	.pipe(buffer())
  	.pipe(gutil.env.production ? uglify() : gutil.noop())
  	.pipe(gulp.dest('build/scripts/'));
});

// gulp.task( 'browserify', function() {
// 	var b = browserify({
//     entries: './site/scripts/script.js',
//     debug: true
//   });

//   return b.bundle()
//   	.pipe(source('main.js'))
//   	.pipe(buffer())
//   	.pipe(gulp.dest('build/scripts/'));
// });

gulp.task( 'eslint', function(  )
{
	return gulp.src( [path.to.scripts.source, "!"+path.to.scripts.lib_source] )
		.pipe( eslint(  ) )
		.pipe( eslint.format(  ) );
} );

gulp.task( 'scripts', [ 'bower', 'vendor' ], function(  )
{
	var b = browserify({
    entries: './site/scripts/script.js',
    debug: true
  });

	return b.bundle()
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(gutil.env.production ? uglify() : gutil.noop())
		.pipe( gulp.dest( path.to.scripts.destination ) );
} );

