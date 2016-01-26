var poem = angular.module('poem');

poem.controller( 'PoemController', function($rootScope, $scope, $state, Poem) {
	$state = 'poem';
	Poem.get($stateParams.poemId).then(function(poem) {
		$scope.poem = poem;
	});
});