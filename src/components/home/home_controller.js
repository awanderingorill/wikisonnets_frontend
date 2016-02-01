
var home = angular.module( 'home' );

home.controller( 'HomeController', function( $rootScope, $scope, $state) {

	
	//do stuff here to get latest poem
	$state.go('poem', {poemId: 1});
});