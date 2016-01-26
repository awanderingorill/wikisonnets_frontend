var poem = angular.module( 'poem', ['ui.router', 'Poem']);

poem.config( function( $stateProvider ) {
	$stateProvider.state( 'poem', 
	{
		url: '/poems/:poemId',
		views:
		{
			'': {
				templateUrl: 'components/poems/poem_template.html',
				controller: 'PoemController as poem'
			},
			'header@poem': {
				templateUrl: 'components/header/header_template.html'
			}
		}
	});
});