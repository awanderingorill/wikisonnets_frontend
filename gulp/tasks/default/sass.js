var gulp      = require( 'gulp' );
var gutil     = require( 'gulp-util' );

var cache = require( 'gulp-cached' );
var sass      = require( 'gulp-sass' );
var prefix    = require( 'gulp-autoprefixer' );
var scsslint  = require( 'gulp-scss-lint' );
var csscomb   = require( 'gulp-csscomb' );
var gutil 		= require( 'gulp-util' );
var nano 			= require('gulp-cssnano');

var path      = require( '../../paths.js' );
var error     = require( '../../error-handler.js' );


gulp.task( 'vendor-css', function( ) {
	return gulp.src("./bower_components/jquery-ui/themes/base/jquery-ui.min.css")
		.pipe(gulp.dest("./build"));
});

gulp.task( 'csscomb', function (  )
{
	return gulp.src( path.to.sass.source )
		.pipe( cache( 'csscomb' ) )
		.pipe( csscomb(  ) )
		.on( 'error', error.handler )
		.pipe( gulp.dest( './site' ) );
} );

gulp.task( 'scss-lint', [ 'csscomb' ], function(  )
{
	return gulp.src( path.to.sass.source )
		.pipe( scsslint( { 'config': 'scss-linting-config.yml' } ) )
		.on( 'error', error.handler );
} );

gulp.task( 'sass', [ 'vendor-css' ], function(  )
{
	return gulp.src( path.to.sass.main )
		//.pipe( cache( 'sass' ) )
		.pipe( sass(  ) )
		.on( 'error', error.handler )
		.pipe( prefix( 'last 2 versions', { cascade: true } ) )
		.on( 'error', error.handler )
		.pipe(gutil.env.production ? nano() : gutil.noop())	
		.pipe( gulp.dest( path.to.sass.destination ) );
} );