var header = angular.module('header');

header.controller('HeaderController', function($rootScope, $scope, $stateParams, $state) {
	$scope.goToAbout = function() {
		$state.go('about');
	};
});