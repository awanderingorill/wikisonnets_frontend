var about = angular.module('about', ['ui.router', 'header']);

about.config( function($stateProvider) {
	$stateProvider.state( 'about',
	{
		url: '/about',
		views: {
			'': {
				templateUrl: 'components/about/about_template.html',
				controller: 'AboutController as about'
			},
			'header@about': {
				templateUrl: 'components/header/header_template.html',
				controller: 'HeaderController as header'
			}
		}
	});
});