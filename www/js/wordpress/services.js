angular.module('wordpress.services', [])
.factory('Wordpress', function($http, $q) {
	return {		
		getRecentPosts :function(){
	        var deferred = $q.defer();
	        var params = {	            
	        };
	        
	        $http({
	            method  : 'GET',
	            url     : wpConfig.api.recentPost,
	            params  : params                
	        }).success(function(data) {
	            deferred.resolve(data);
	        }).error(function(data) {
	            deferred.resolve(data);
	        });
	        return deferred.promise;
	    }
	}
})