var tooltipFactory = angular.module('Tooltip', []);

tooltipFactory.factory('Tooltip', function($http, $q) {
	var tooltipApi = { };

	tooltipApi.get = function(pageId, revisionId, line) {
		var deferred = $q.defer();
		var promise = deferred.promise;

		$http({
			method: 'get',
			url: '/api/pages/' + pageId + '/tooltip',
			params: {
				revisionId: revisionId,
				line: line
			}
		})
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(error) {
			deferred.reject( error );
		});
		return promise;
	};

	return tooltipApi;
});