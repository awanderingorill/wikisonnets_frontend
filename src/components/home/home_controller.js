
var home = angular.module( 'home' );

home.controller( 'HomeController', function( $rootScope, $scope, $state, Poem) {
	
	//may need to be careful with utc times and stuff
	var options = {
		limit: 1
	}
	//need to leave this like this instead of passing
	//the whole poem because sessions
	Poem.index(options).then(function(poems) {
		$state.go('poem', {poemId: poems[0].id});
	});

});