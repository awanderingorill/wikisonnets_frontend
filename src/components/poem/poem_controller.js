var poem = angular.module('poem');

poem.controller( 'PoemController', function($rootScope, $scope, $stateParams, $state, $timeout, Poem, Tooltip) {

	$scope.createPoem = function(data) {
		//create a poem;
		if (data && data.title) {
			Poem.create(data.title).then(function(poem) {
				$scope.poem = poem;
				$state.go('poem', {poemId: poem.id, poem: poem});
			});
		}
	};

	$scope.fetchPoem = function(id) {
		Poem.get(id).then(function(poem) {
			console.log(poem);
			if (!poem.complete) {
				setTimeout($scope.fetchPoem, 1000, poem.id);
			}
			$scope.fetchPoemTooltips(poem);
		});
	}

	$scope.fetchPoemTooltips = function(poem) {
		if (!$scope.poem.id) {
			$scope.poem = poem;
		}
		else if (!$scope.poem.lines) {
			$scope.poem.lines = poem.lines;
		}
		else {
			poem.lines.forEach(function(line, index) {
				if (!$scope.poem.lines[index].tooltip) {
					$scope.poem.lines[index] = line;
				}
			});
		}
	}

	$scope.goToPoem = function(poemId) {
		$state.go('poem', {poemId: poemId});
		// Poem.get(poemId).then(function(poem) {
		// 	$state.go('poem', {poemId: poemId, poem: poem});
		// });
	}

	$scope.goToRandomPoem = function() {
		Poem.getRandom().then(function(poem) {
			$state.go('poem', {poemId: poem.id, poem: poem});
		});
	}

	if ($stateParams.poem && $stateParams.poem.complete) {
		$scope.fetchPoemTooltips($stateParams.poem);
	}
	else if ($stateParams.poem) {
		$scope.poem = $stateParams.poem;
		$scope.fetchPoem($stateParams.poemId);
	}
	else {
		$scope.fetchPoem($stateParams.poemId);
	}

});