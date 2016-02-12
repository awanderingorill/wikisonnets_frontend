
var home = angular.module( 'home' );

home.controller( 'HomeController', function( $rootScope, $scope, $state, Poem) {

	//may need to be careful with utc times and stuff
	var options = {
		limit: 1
	}
	Poem.index(options).then(function(poems) {
		$state.go('poem', {poemId: poems[0].id});
	});

});