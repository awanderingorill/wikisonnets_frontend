'use strict';
console.log("Starting app!");

var appWikisonnetClient = angular.module( 'appWikisonnetClient',
[
	'main'
]);

appWikisonnetClient.config(function($logProvider, $urlRouterProvider, $locationProvider) {
  $logProvider.debugEnabled(true);
  $urlRouterProvider.otherwise( '/' );
	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});
});

appWikisonnetClient.run(function($log) {
	console.log("running client");
  $log.debug('runBlock end');
});