var snippetFilter = angular.module('snippetFilter', []);

snippetFilter.filter('preLinePortion', function() {
	return function(snippet, line) {
		var startIndex = snippet.indexOf(line);
		return snippet.slice(0, startIndex);
	};
});

snippetFilter.filter('postLinePortion', function() {
	return function(snippet, line) {
		var startIndex = snippet.indexOf(line);
		var endIndex = startIndex + line.length;
		return snippet.slice(endIndex);
	};
});