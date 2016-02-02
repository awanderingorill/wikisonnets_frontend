var underscoreFilter = angular.module('underscoreFilter', []);

underscoreFilter.filter('removeUnderscores', function() {
	return function(text) {
		return text.replace(/\_/g, " ");
	}
});