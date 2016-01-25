
var main = angular.module( 'main',
[
	'ui.router'
] );

main.config( function( $stateProvider )
{
	$stateProvider.state( 'main',
	{
		url: '/',
		views:
		{
			homepage:
			{
				templateUrl: 'components/main/main_template.html',
				controller: 'MainController as main'
			}
		}
	} );
} );