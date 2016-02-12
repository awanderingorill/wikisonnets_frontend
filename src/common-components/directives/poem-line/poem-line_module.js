var poemLines = angular.module('poemLine', ['Tooltip']);

poemLines.directive( 'poemLine', function($timeout) {
	return {
		restrict: 'E',
		scope: false,
		controller: 'PoemLineController',
		templateUrl: 'common-components/directives/poem-line/poem-line_template.html',
		link: function(scope, element, attr) {
			$(".poem").on('mouseenter', '.poem__line, [class^="poem__line--"], [class*=" poem__line--"]', function(event) {
				$('.poem__line, [class^="poem__line--"], [class*=" poem__line--"]').removeClass("active");
				$(event.target).addClass("active");
				$('html, body').stop().animate({ scrollTop: $(document).height() }, 700);
				return false;
			});
		}
	}
});