angular.module('appWikisonnetClient', []).factory('Poem', function( $http, $q, appConstants, storageFactory ) {
  var poemApi = { };

	poemApi.get = function(poemId) {
		var deferred = $q.defer(  );
		var promise = deferred.promise;

		$http({
			method: 'get',
			url: '/poems/' + poemId,
			withCredentials: true,
		})
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(error) {
			deferred.reject( error );
		});
		return promise;
	};

	return poemApi;
});