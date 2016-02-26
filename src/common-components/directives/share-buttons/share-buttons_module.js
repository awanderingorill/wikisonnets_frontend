var shareButtons = angular.module('shareButtons', ['720kb.socialshare']);

shareButtons.directive('shareButtons', function() {
	return {
		restrict: 'E',
		scope: false,
		templateUrl: 'common-components/directives/share-buttons/share-buttons_template.html',
		link: function(scope, element, attr) {
			$(".share-button").click(function(event) {
				$(this).toggleClass("active");
			});

			// scope.$watch('poem.id', function(oldValue, newValue) {
			// 	if (newValue !== oldValue) {
			// 		scope.$digest();
			// 	}
			// }, true);
		}
	}
});