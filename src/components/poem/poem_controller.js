var poem = angular.module('poem');

poem.controller( 'PoemController', function($rootScope, $scope, $stateParams, $state, $timeout, Poem, Tooltip) {

	$scope.createPoem = function(data) {
		//create a poem;
		if (data && data.title) {
			Poem.create(data.title).then(function(poem) {
				$scope.poem = poem;
				$state.go('poem', {poemId: poem.id});
				if (poem.lines) {
					poem.lines.forEach(function(line, index) {
						if (line.text !== "" && !$scope.poem.lines[index].tooltip) {
							console.log("Line at index " + index + " is being requested, from create poem.");
							var p = Tooltip.get(line.page_id, line.revision, line.text).then(function(tooltip) {
								$scope.poem.lines[index].tooltip = tooltip;
							});
							$scope.poem.lines[index].promise = p;
						}
					});
				}
				if (!poem.complete) {
					console.log(poem);
					setTimeout($scope.fetchPoem, 1000, poem.id);
				}
			});
		}
	};

	$scope.fetchPoem = function(id) {
		Poem.get(id).then(function(poem) {
			console.log(poem);
			// $scope.poem = poem;
			// if (!$scope.poem || Object.keys($scope.poem).length === 0) {
			// 	$scope.poem = poem;
			// }
			// else if (!$scope.poem.lines) {
			// 	$scope.poem.lines = poem.lines;
			// }
			// else {
			// 	poem.lines.forEach(function(line, index) {
			// 		if ($scope.poem.lines[index].promise && $scope.poem.lines[index].promise.$$state.status === 0) {
			// 			console.log("Line at index " + index + " has a promise pending.");
			// 		}
			// 		if (!$scope.poem.lines[index].tooltip
			// 			&& !($scope.poem.lines[index].promise && $scope.poem.lines[index].promise.$$state.status === 0)) {
			// 			console.log("Assigning line at index " + index + " to API response.");
			// 			$scope.poem.lines[index] = line;
			// 		}
			// 	});
			// }
	  //   // $scope.$broadcast('angucomplete-alt:changeInput', 'poem-title', poem.title);
			// if (poem.lines) {
			// 	poem.lines.forEach(function(line, index) {
			// 		if (line.text !== "" && !$scope.poem.lines[index].tooltip 
			// 				&& !($scope.poem.lines[index].promise && $scope.poem.lines[index].promise.$$state.status === 0)) {
			// 			console.log("Line at index " + index + " is being requested.");
			// 			var p = Tooltip.get(line.page_id, line.revision, line.text).then(function(tooltip) {
			// 				$scope.poem.lines[index].tooltip = tooltip;
			// 			});
			// 			$scope.poem.lines[index].promise = p;
			// 		}
			// 	});
			// }
			$scope.fetchPoemTooltips(poem);
			if (!poem.complete) {
				console.log(poem);
				setTimeout($scope.fetchPoem, 1000, poem.id);
			}
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

		if (poem.lines) {
			poem.lines.forEach(function(line, index) { 
				if (line.text !== "" && !$scope.poem.lines[index].tooltip) {
					var p = Tooltip.get(line.page_id, line.revision, line.text).then(function(tooltip) {
						$scope.poem.lines[index].tooltip = tooltip;
					});
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

	if ($stateParams.poem) {
		$scope.fetchPoemTooltips($stateParams.poem);
	}
	else {
		$scope.fetchPoem($stateParams.poemId);
	}

});