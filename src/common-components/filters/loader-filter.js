var loaderFilter = angular.module('loaderFilter', []);

loaderFilter.filter('loaderText', function() {
	return function(queueLength) {
		if (queueLength) {
			if (queueLength === 1) {
				return "Fetching poem, waiting for " + queueLength + " poem to finish";
 			}
 			else {
 				return "Fetching poem, waiting for " + queueLength + " poems to finish";
 			}
		}	
		else {
			return "Fetching poem";
		}
	}
});