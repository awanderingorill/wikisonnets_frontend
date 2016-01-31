// File globs.

var path = require( 'path' );

var pathToThisFile = __dirname;
var root = path.dirname( pathToThisFile );

var destination = root + '/dist/';
var bowerDir = destination + '/bower';

module.exports =
{
	to:
	{
		destination: destination,
		main:
		{
			css:
			{
				file: 'app_styles.css'
			},
			script:
			{
				file: 'angular-main.js'
			}
		},
		jade:
		{
			source: root + '/src/**/*.jade',
			pages: root + '/src/**/*.jade',
			destination: destination
		},
		sass:
		{
			source: root + '/src/**/*.scss',
			main: root + '/src/app_styles.scss',
			destination: destination + 'styles'
		},
		scripts:
		{
			source: root + '/src/**/*.js',
			lib_source: root + '/src/scripts/lib/**/*.js',
			main: root + '/src/scripts/main.js',
			lib_destination: root + '/src/scripts/lib',
			destination: destination + 'scripts'
		},
		images:
		{
			source: root + '/images/**/*.*',
			destination: destination + 'images'
		},
		favicon:
		{
			source: root + '/favicon.png',
			destination: destination
		},
		bower:
		{
			source: root + '/bower_components',
			manifest: root + '/bower.json',
			config: root + '/.bowerrc',
			destination: bowerDir,
			css: bowerDir + '/**/*.css',
			scripts: bowerDir + '/**/*.js'
		},
		inject: {
			target: root + '/src/index.jade',
		}
	}
};