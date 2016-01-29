var poem = angular.module('poem');

poem.controller( 'PoemController', function($rootScope, $scope, $stateParams, $state, Poem, Tooltip) {
	// Poem.get($stateParams.poemId).then(function(poem) {
	// 	$scope.poem = poem;
	// 	poem.lines.forEach(function(line, index) {
	// 		Tooltip.get(line.page_id, line.revision, line.text).then(function(tooltip) {
	// 			$scope.poem.lines[index].tooltip = tooltip;
	// 		});
	// 	});
	// });

	$scope.createPoem = function(data) {
		console.log(data);
		//create a poem;
		Poem.create(data.title).then(function(poem) {
			$scope.poem = poem;
			if (poem.lines) {
				poem.lines.forEach(function(line, index) {
					Tooltip.get(line.page_id, line.revision, line.text).then(function(tooltip) {
						$scope.poem.lines[index].tooltip = tooltip;
					});
				});
			}
			if (!poem.complete) {
				console.log(poem);
				setTimeout($scope.fetchPoem.bind(this, poem.id), 1000);
			}
		});
	};

	$scope.fetchPoem = function(id) {
		Poem.get(id).then(function(poem) {
			$scope.poem = poem;
			if (poem.lines) {
				poem.lines.forEach(function(line, index) {
					Tooltip.get(line.page_id, line.revision, line.text).then(function(tooltip) {
						$scope.poem.lines[index].tooltip = tooltip;
					});
				});
			}
			if (!poem.complete) {
				console.log(poem);
				setTimeout($scope.fetchPoem.bind(this, poem.id), 1000);
			}
		});
	}

	$scope.fetchPoem($stateParams.poemId);

});