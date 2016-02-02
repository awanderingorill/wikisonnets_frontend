var underscoreFilter = angular.module('underscoreFilter', []);

underscoreFilter.filter('removeUnderscores', function() {
	return function(text) {
		if (typeof text === "string") {
			return text.replace(/\_/g, " ");
		}
		else {
			return "";
		}
	}
});