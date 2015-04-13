angular.module('wordpress.controllers', [])

.controller('WordpressCtrl', function($state, $scope, $ionicModal, $timeout, Wordpress) {

	$scope.goPage = function(page)
    {
        $state.go('app.wordpress.'+page);
    };
})
.controller('WordpressNewsCtrl', function($scope, $stateParams, $timeout, $ionicLoading, Wordpress){
	var isLoadMore = false,
        page = 1;
    $scope.news = [];
    
    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });
  
    $scope.moreDataCanBeLoaded = function(){
        return isLoadMore;
    };
    
    $scope.loadMore = function() {
        $timeout(function() {
            loadList();
        }, 300);
    };
    
    $scope.doRefresh = function(){
        page = 1;
        $scope.news = [];       
        loadList();
        $scope.$broadcast('scroll.refreshComplete');
    };
    
    function loadList() {
        var params = {
            path : $stateParams.categoryId,
            page : page
        };
        $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i> Loading...'
        });
        Wordpress.getRecentPosts().then(function(data){
        	if (data.status == 'ok')
	        {
	            if (data.count > 0) {
	                for (var i = 0; i < data.count; i++) {
	                    $scope.news.push(data.posts[i]);
	                }
	                page++;
	                isLoadMore = true;
	            }
	            else{
	                isLoadMore = false;
	            }
	        }
	        else {
	            console.log(data.message);
	        }    

	        //Hide loading
	        //isLoadMore = false;
	        $scope.$broadcast('scroll.infiniteScrollComplete');
	        $ionicLoading.hide();
        })
    }
})