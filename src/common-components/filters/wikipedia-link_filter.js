var wikipediaLinkFilter = angular.module('wikipediaLinkFilter', []);

wikipediaLinkFilter.filter('wikipediaLink', function() {
	return function(title) {
		if (title && title.length > 0) {
			return "https://en.wikipedia.org/wiki/" + title.replace(" ", "_");
		}
		else {
			return "";
		}
	};
});