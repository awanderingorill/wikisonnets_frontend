var poemLines = angular.module('poemLine');

poemLines.controller('PoemLineController', function($rootScope, $scope, Tooltip) {
	if ($scope.line.text !== "" && !$scope.line.tooltip) {
		Tooltip.get($scope.line.page_id, $scope.line.revision, $scope.line.text).then(function(tooltip) {
			$scope.line.tooltip = tooltip;
		});
	}
});