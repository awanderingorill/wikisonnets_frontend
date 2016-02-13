'use strict';

var appWikisonnetClient = angular.module( 'appWikisonnetClient',
[
	'home',
	'poem',
	'about'
]);

appWikisonnetClient.config(function($logProvider, $urlRouterProvider, $locationProvider) {
  $logProvider.debugEnabled(true);
  $urlRouterProvider.otherwise( '/' );
	$locationProvider.html5Mode(true);
});

appWikisonnetClient.run(function($log, $rootScope) {
  $log.debug('Wikisonnet is running!');
});