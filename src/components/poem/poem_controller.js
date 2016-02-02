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
							Tooltip.get(line.page_id, line.revision, line.text).then(function(tooltip) {
								$scope.poem.lines[index].tooltip = tooltip;
							});
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
			$scope.poem = poem;
	    // $scope.$broadcast('angucomplete-alt:changeInput', 'poem-title', poem.title);
			if (poem.lines) {
				poem.lines.forEach(function(line, index) {
					if (line.text !== "" && !$scope.poem.lines[index].tooltip) {
						Tooltip.get(line.page_id, line.revision, line.text).then(function(tooltip) {
							$scope.poem.lines[index].tooltip = tooltip;
						});
					}
				});
			}
			if (!poem.complete) {
				console.log(poem);
				setTimeout($scope.fetchPoem.bind(this, poem.id), 1000);
			}
			if (Poem.poems) {
				$scope.nextPoem = Poem.poems[Poem.currentPoemIndex + 1];
				if (currentPoemIndex > 0) {
					$scope.previousPoem = Poem.poems[Poem.currentPoemIndex - 1];
				}
			}
		});
	}

	$scope.fetchPoem($stateParams.poemId);
	//get five poems before and five poems after

});