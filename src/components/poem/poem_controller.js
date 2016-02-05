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
							var p = Tooltip.get(line.page_id, line.revision, line.text).then(function(tooltip) {
								$scope.poem.lines[index].tooltip = tooltip;
							});
							$scope.poem.lines[index].promise = p;
						}
					});
				}
				if (!poem.complete) {
					console.log(poem);
					setTimeout($scope.fetchPoem.bind(this, poem.id), 1000);
				}
			});
		}
	};

	$scope.fetchPoem = function(id) {
		Poem.get(id).then(function(poem) {
			console.log(poem);
			// $scope.poem = poem;
			if (!$scope.poem || Object.keys($scope.poem).length === 0) {
				$scope.poem = poem;
			}
			else if (!$scope.poem.lines) {
				$scope.poem.lines = poem.lines;
			}
			else {
				poem.lines.forEach(function(line, index) {
					if ($scope.poem.lines[index].promise && $scope.poem.lines[index].promise.$$state.status === 0) {
						console.log("Line at index " + index + " has a promise pending.");
					}
					if (!$scope.poem.lines[index].tooltip
						&& !($scope.poem.lines[index].promise && $scope.poem.lines[index].promise.$$state.status === 0)) {
						$scope.poem.lines[index] = line;
					}
				});
			}
	    // $scope.$broadcast('angucomplete-alt:changeInput', 'poem-title', poem.title);
			if (poem.lines) {
				poem.lines.forEach(function(line, index) {
					if (line.text !== "" && !$scope.poem.lines[index].tooltip 
							&& !($scope.poem.lines[index].promise && $scope.poem.lines[index].promise.$$state.status === 0)) {
						console.log("Line at index " + index + " is being requested.");
						var p = Tooltip.get(line.page_id, line.revision, line.text).then(function(tooltip) {
							$scope.poem.lines[index].tooltip = tooltip;
						});
						$scope.poem.lines[index].promise = p;
					}
				});
			}
			if (!poem.complete) {
				console.log(poem);
				setTimeout($scope.fetchPoem.bind(this, poem.id), 1000);
			}
		});
	}

	$scope.goToPoem = function(poemId) {
		$state.go('poem', {poemId: poemId});
	}

	$scope.fetchPoem($stateParams.poemId);
	//get five poems before and five poems after

});