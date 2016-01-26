'use strict';

var appWikisonnetClient = angular.module( 'appWikisonnetClient',
[
	'home',
	'poem'
]);

appWikisonnetClient.config(function($logProvider, $urlRouterProvider, $locationProvider) {
  $logProvider.debugEnabled(true);
  $urlRouterProvider.otherwise( '/' );
	$locationProvider.html5Mode(true);
});

appWikisonnetClient.run(function($log) {
  $log.debug('runBlock end');
});