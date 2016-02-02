
var home = angular.module( 'home' );

home.controller( 'HomeController', function( $rootScope, $scope, $state, Poem) {

	//may need to be careful with utc times and stuff
	var dateString = moment.utc().format("YYYY-MM-DD");
	var options = {
		limit: 10
	}
	Poem.index(options).then(function(poems) {
		$state.go('poem', {poemId: poems[Poem.currentPoemIndex].id});
	});

});