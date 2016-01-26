var poem = angular.module( 'poem', ['ui.router', 'Poem', 'Tooltip', 'snippetFilter']);

poem.config( function( $stateProvider ) {
	$stateProvider.state( 'poem', 
	{
		url: '/poems/:poemId',
		views:
		{
			'': {
				templateUrl: 'components/poem/poem_template.html',
				controller: 'PoemController as poem'
			},
			'header@poem': {
				templateUrl: 'components/header/header_template.html'
			}
		}
	});
});