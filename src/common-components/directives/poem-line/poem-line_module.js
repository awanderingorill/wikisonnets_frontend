var poemLines = angular.module('poemLine', []);

poemLines.directive( 'poemLine', function($timeout) {
	return {
		restrict: 'E',
		scope: false,
		controller: 'PoemLineController',
		templateUrl: 'common-components/directives/poem-line/poem-line_template.html',
		link: function(scope, element, attr) {
			$timeout(function () {
				element.on('mouseenter', function(event) {
					if (angular.element(event.target).parent().hasClass("poem__line-wrapper")) {
						event.preventDefault();
						angular.element(event.target).parent().parent().children().children().removeClass("active");
						angular.element(event.target).addClass("active");
					}
				});
			});
		}
	}
});