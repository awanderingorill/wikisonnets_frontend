var poemLines = angular.module('poemLine');

poemLines.controller('PoemLineController', function($rootScope, $scope, Tooltip) {
	if ($scope.line.text !== "" && !$scope.line.tooltip && !$scope.line.promise) {
		var p = Tooltip.get($scope.line.page_id, $scope.line.revision, $scope.line.text).then(function(tooltip) {
			$scope.line.tooltip = tooltip;
			$scope.line.promise = undefined;
		});
		$scope.line.promise = p;
	}
});