var poem = angular.module('poem');

poem.controller( 'PoemController', function($rootScope, $scope, $stateParams, $state, Poem, Tooltip) {
	Poem.get($stateParams.poemId).then(function(poem) {
		$scope.poem = poem;
		poem.lines.forEach(function(line, index) {
			Tooltip.get(line.page_id, line.revision, line.text).then(function(tooltip) {
				$scope.poem.lines[index].tooltip = tooltip;
			});
		});
	});

	$scope.fetchPoem = function(data) {
		console.log(data);
	}
});