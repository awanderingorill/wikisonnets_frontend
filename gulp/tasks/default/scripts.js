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

//new angular stuff
var streamqueue     = require( 'streamqueue' );
var order           = require( 'gulp-order' );
var filter          = require( 'gulp-filter' );
var ngAnnotate      = require( 'gulp-ng-annotate' );
var angularFilesort = require( 'gulp-angular-filesort' );
var concat          = require( 'gulp-concat' );


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

gulp.task('angular-scripts', function( ) {
	return streamqueue( { objectMode: true },
		gulp.src(mainBowerFiles(
		{
			paths:
			{
				bowerDirectory: './bower_components',
				bowerrc: './bowerrc',
				bowerJson: './bower.json'
			}
		} ),
		{
			base: './bower_components'
		} )
			.pipe( order(
				[
					'angular/angular.js',
					'*'
				]
			))
			.pipe( filter( '**/*.js' ) ),
		gulp.src( ['./src/*.js', './src/**/*.js'] )
			.pipe( ngAnnotate(
			{
				remove: true,
				add: true,
				single_quotes: true
			} ) )
			.pipe( angularFilesort(  ) ) )
	.pipe( concat( 'angular-main.js' ) )
	// .pipe( uglify(  ) )
	.pipe( gulp.dest( './dist/scripts' ) );
});

