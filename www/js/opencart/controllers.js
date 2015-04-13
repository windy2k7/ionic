angular.module('starter.controllers', [])
.controller('AppCtrl', function($state, $stateParams,  $scope, $ionicModal, $timeout, Categories, Carts) {
    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/common/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
    
    //Get list categories
    Categories.getList().then(function(data){
        if(data.success){
            $scope.categories = data.result.categories;
        }        
    });
    
    //Shopping Cart
    $scope.cart = {
        total : '',
        add : function(product_id, quantity)
        {
            var params = {
                product_id : product_id,
                quantity : quantity || 1
            };            
            Carts.add(params).then(function(data){
                $scope.cart.total = data.result.total;
            });
        }
    }
})
.controller('ProductsCtrl', function($scope, $stateParams, $timeout, $ionicLoading, Products) {    
    var isLoadMore = false,
        page = 1;
    $scope.products = [];
    
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
        $scope.products = [];       
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
        Products.getList(params).then(function(data) {
            if (data.success)
            {
                if (data.result.hasOwnProperty('products') && data.result.products.length > 0) {
                    for (var i = 0; i < data.result.products.length; i++) {
                        $scope.products.push(data.result.products[i]);
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
            isLoadMore = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $ionicLoading.hide();
        });
    }
})
.controller('ProductCtrl', function($scope, $stateParams, $ionicLoading, $ionicModal, $ionicSlideBoxDelegate, Products) {
    
    $scope.product = {};

    $scope.$on('$stateChangeSuccess', function() {
        loadDetail($stateParams.productId);
    });

    $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
    };
    
    $scope.showDescription = function()
    {
        $scope.product.description_short = $scope.product.description.substring(0, 200)+' ...';                    
        //Init Modal
        $ionicModal.fromTemplateUrl('templates/product/description.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.productDescriptModal = modal;
            modal.show();
        });
    };
    
    function loadDetail(productId)
    {
        $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i> Loading...'
        });

        Products.getDetail(productId).then(function(data) {
            if (data.success)
            {
                if (data.result.hasOwnProperty('product_id')) {
                    $scope.product = data.result;                    
                }                
                console.log(data);
            }
            else {
                console.log(data.message);
            }
            $ionicLoading.hide();
        });
    }
})
.controller('ReviewCtrl', function($scope, $stateParams, $ionicLoading, $ionicModal, $ionicPopup, $ionicSlideBoxDelegate, $ionicScrollDelegate, $timeout, Reviews){    
    var isLoadMore = false,
        page = 1,
        productId = null;
    $scope.reviews = [];
    
    $scope.$on('$stateChangeSuccess', function() {
        productId = $stateParams.productId;
        loadList(productId);
    });
    
    $scope.moreDataCanBeLoaded = function(){
        return isLoadMore;
    };
    
    $scope.loadMore = function() {
        $timeout(function() {
            loadList(productId);
        }, 300);
    };
    
    $scope.doRefresh = function(){
        page = 1;
        $scope.reviews = [];       
        loadList(productId);
        $scope.$broadcast('scroll.refreshComplete');
    };
    
    function loadList(product_id) {
        var params = {
            product_id  : product_id,
            page        : page
        };
        //Show loading
        $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i> Loading...'
        });
        //Get data
        Reviews.getList(params).then(function(data) {
            if (data.success)
            {
                if (data.result.hasOwnProperty('reviews') && data.result.reviews.length > 0) {
                    for (var i = 0; i < data.result.reviews.length; i++) {
                        $scope.reviews.push(data.result.reviews[i]);
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
            isLoadMore = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $ionicLoading.hide();
        });
    }       
    
    $scope.showDetail = function(review)
    {        
        $scope.review = review;
        
        $ionicModal.fromTemplateUrl('templates/review/view.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.reviewModal = modal;
            modal.show();
        });
    };
    
    $scope.showFormReview = function()
    {
        $scope.urlCapcha = baseConfig.getApiUrl()+'?route=product/product/captcha';
        $scope.form = {
            name : '',
            text : '',
            rating : '',
            captcha : ''
        };
        
        $ionicModal.fromTemplateUrl('templates/product/form.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.productReviewFormModal = modal;
            $scope.productReviewFormModal.show();
        });
    };
    
    $scope.saveReview = function()
    {
        //Show loading
        $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i> Loading...'
        });
        //Insert review
        Reviews.insertReview($scope.product.product_id, $scope.form).then(function(data){
            if(data.success){
                var alertPopup = $ionicPopup.alert({
                 title: 'Alert',
                 template: data.message
                });
                alertPopup.then(function(res) {
                    $scope.form = {};
                    $scope.productReviewFormModal.hide();
                });
            }
            else{
                $ionicPopup.alert({
                    title: 'Alert',
                    template: data.message
                });
            }
            //Hide loading
            $ionicLoading.hide();
        });        
    };
})
.controller('AccountCtrl', function($scope, $state, $stateParams, $ionicLoading, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, Accounts) {
    
    $scope.$on('$stateChangeSuccess', function() {
        $scope.page = $stateParams.page;
    });
    
    $scope.goPage = function(page){
        $scope.page = page;
    };
    
    $scope.users = Accounts.all();
});
