
var home = angular.module( 'home',
[
	'ui.router'
] );

home.config( function( $stateProvider )
{
	$stateProvider.state( 'home',
	{
		url: '/',
		views:
		{
			'': {
				templateUrl: 'components/home/home_template.html',
				controller: 'HomeController as home'
			},
			'header@home': {
				templateUrl: 'components/header/header_template.html'
			}

		}
	} );
} );