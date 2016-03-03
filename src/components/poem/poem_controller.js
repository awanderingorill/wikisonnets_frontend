var poem = angular.module('poem');

poem.controller( 'PoemController', function($rootScope, $scope, $stateParams, $state, $timeout, Poem, Tooltip, $location) {
	$scope.createPoem = function(data) {
		//create a poem;
		if (data && data.title) {
			//reset stuff to default
			$scope.poem.lines = undefined;
			$scope.poem.imageUrl = undefined;
			$rootScope.sortOrder = 'mostRecent';
			Poem.create(data.title).then(function(poem) {
				$scope.poem = poem;
				$state.go('poem', {poemId: poem.id, poem: poem});
			});
		}
	};

	$scope.fetchPoem = function(id) {
		Poem.get(id, $rootScope.sortOrder).then(function(poem) {
			console.log(poem);
			if (!poem.complete) {
				setTimeout($scope.fetchPoem, 1000, poem.id);
			}
			$scope.fetchPoemTooltips(poem);
		}).catch(function(e) {
			$location.url('/');
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
				var scopeLine = $scope.poem.lines[index];
				if (!scopeLine.tooltip && !scopeLine.promise) {
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

	//idk why i have to do this but angular is being dumb
	$scope.onSelectChange = function() {
		$rootScope.sortOrder = this.sortOrder;
		if ($rootScope.sortOrder === 'featured') {
			if ($scope.poem.featured) {
				var poemId = $scope.poem.id;
				$scope.poem = null;
				Poem.get(poemId, $rootScope.sortOrder).then(function(poem) {
					console.log(poem);
					$scope.poem = poem;
					$scope.fetchPoemTooltips(poem);
				});
			}
			else {
				$scope.poem = null;
				Poem.index({limit: 1, featured: 1}).then(function(poems) {
					$state.go('poem', {poemId: poems[0].id})
				});
			}
		}
		else {
			var poemId = $scope.poem.id;
			$scope.poem = null;
			Poem.get(poemId, $rootScope.sortOrder).then(function(poem) {
				console.log(poem);
				$scope.poem = poem;
				$scope.fetchPoemTooltips(poem);
			});
		}
	}

	$location.search('status', null);

	if (!$rootScope.sortOrder) {
		$rootScope.sortOrder = 'mostRecent';
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

	//my b for this, but idk where to put this
	$timeout(function () {
    $("#poem-title_value").focus();
  }, 500);

});