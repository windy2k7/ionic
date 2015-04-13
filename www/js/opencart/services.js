angular.module('starter.services', [])
.factory('Categories', function($http, $q) {
  
  return {
    getList : function(){
        var deferred = $q.defer();
        var params = {
            route : 'module/category'
        };
        
        $http({
            method  : 'GET',
            url     : baseConfig.getApiUrl(),
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
.factory('Products', function($http, $q) {
  // Some fake testing data
  var products = [{
    id: 0,
    name: 'Ben Sparrow',
    description: 'You on your way?',
    image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    description: 'Hey, it\'s me',
    image: 'https://pbs.twimg.com/profile_images/479740132258361344/KaYdH9hE.jpeg'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    description: 'Did you get the ice cream?',
    image: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    description: 'I should buy a boat',
    image: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    description: 'Look at my mukluks!',
    image: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];
    
  return {
    all: function() {
      return products;
    },
    remove: function(chat) {
      products.splice(products.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < products.length; i++) {
        if (products[i].id === parseInt(chatId)) {
          return products[i];
        }
      }
      return null;
    },
    getDetail : function(productId)
    {
        var deferred = $q.defer();
        var params = {
            route : 'product/product',
            path : '',
            product_id : productId
        };
        
        $http({
            method  : 'GET',
            url     : baseConfig.getApiUrl(),
            params  : params                
        }).success(function(data) {
            deferred.resolve(data);
        }).error(function(data) {
            deferred.resolve(data);
        });
        return deferred.promise;
    },
    getList : function(params){
        var deferred = $q.defer();
        params.route = 'product/category';        
        $http({
            method  : 'GET',
            url     : baseConfig.getApiUrl(),
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
.factory('Reviews', function($http, $q) {
    return {
        getList : function(params)
        {
            var deferred = $q.defer();
            params.route = 'product/product/review';        
            $http({
                method  : 'GET',
                url     : baseConfig.getApiUrl(),
                params  : params                
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        },
        insertReview : function(product_id, data){
            var deferred = $q.defer();        
            $http({
                method  : 'POST',            
                url     : baseConfig.getApiUrl()+'?route=product/product/write&product_id='+product_id,
                data    : data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    }
})
.factory('Accounts', function() {
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://pbs.twimg.com/profile_images/479740132258361344/KaYdH9hE.jpeg'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})
.factory('Carts', function($http, $q){
    return {
        add : function(data){
            var deferred = $q.defer();        
            $http({
                method  : 'POST',            
                url     : baseConfig.getApiUrl()+'?route=checkout/cart/add',
                data    : data
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(data) {
                deferred.resolve(data);
            });
            return deferred.promise;
        }
    }
});
