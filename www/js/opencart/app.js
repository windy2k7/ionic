// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($httpProvider, $stateProvider, $urlRouterProvider) {
    $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/common/menu.html",
                controller: 'AppCtrl'
            })            
            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/common/search.html"
                    }
                }
            })
            .state('app.products', {
                url: "/products/:categoryId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/product/list.html",
                        controller: 'ProductsCtrl'
                    }
                }
            })
            .state('app.product', {
                url: "/product/:productId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/product/view.html",
                        controller: 'ProductCtrl'
                    }
                }
            }) 
            .state('app.review', {
                url: "/reviews/:productId",
                views: {
                    'menuContent': {
                        templateUrl: "templates/review/list.html",
                        controller: 'ReviewCtrl'
                    }
                }
            }) 
            .state('app.account', {
                url: "/account/:page",
                views: {
                    'menuContent': {
                        templateUrl: "templates/account/main.html",
                        controller: 'AccountCtrl'
                    }
                }
            });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/search');
    
    // Use x-www-form-urlencoded Content-Type && X_REQUESTED_WITH
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.common['X_REQUESTED_WITH'] = 'XMLHttpRequest';
    
    /**
    * The workhorse; converts an object to x-www-form-urlencoded serialization.
    * @param {Object} obj
    * @return {String}
    */
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data, getHeaders) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});
