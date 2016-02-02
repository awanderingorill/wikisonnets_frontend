var poemFactory = angular.module( 'Poem', [  ] );

poemFactory.factory('Poem', function( $http, $q ) {
  var poemApi = { };

	poemApi.get = function(poemId) {
		var deferred = $q.defer(  );
		var promise = deferred.promise;

		$http({
			method: 'get',
			url: '/api/poems/' + poemId,
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

	poemApi.create = function(poemTitle) {
		var deferred = $q.defer(  );
		var promise = deferred.promise;

		$http({
			method: 'post',
			url: '/api/poems',
			withCredentials: true,
			data: {
				poemTitle: poemTitle
			}
		})
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(error) {
			deferred.reject(error);
		});
		return promise;
	}

	poemApi.index = function(options) {
		// offset
		// limit 
		// sortby:string 'lauds' or 'date' (ascending? descending?)
		// before:datestring(YYYY-mm-dd) exclusive
		// after:datestring(YYYY-mm-dd) exclusive
		var deferred = $q.defer(  );
		var promise = deferred.promise;

		options = options || {};	
		$http({
			method: 'get',
			url: '/api/poems',
			withCredentials: true,
			params: options
		})
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(function(error) {
			deferred.reject(error);
		});
		return promise;
	}

	return poemApi;
});