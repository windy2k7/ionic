// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'wordpress.controllers', 'wordpress.services', 'ngCordova'])

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
            .state('app.plugins', {
                url: "/plugins",
                views: {
                    'menuContent': {
                        templateUrl: "templates/plugin/main.html",
                        controller: 'PluginsCtrl'
                    }
                }
            })
            .state('app.camera', {
                url: "/camera",
                views: {
                    'menuContent': {
                        templateUrl: "templates/plugin/camera.html",
                        controller: 'CameraCtrl'
                    }
                }
            })
            .state('app.device', {
                url: "/device",
                views: {
                    'menuContent': {
                        templateUrl: "templates/plugin/device.html",
                        controller: 'DeviceCtrl'
                    }
                }
            })
            .state('app.geo', {
                url: "/geo",
                views: {
                    'menuContent': {
                        templateUrl: "templates/plugin/geo.html",
                        controller: 'GeoCtrl'
                    }
                }
            })
            .state('app.contacts', {
                url: "/contacts",
                views: {
                    'menuContent': {
                        templateUrl: "templates/plugin/contacts.html",
                        controller: 'ContactsCtrl'
                    }
                }
            })
            .state('app.dialogs', {
                url: "/dialogs",
                views: {
                    'menuContent': {
                        templateUrl: "templates/plugin/dialog.html",
                        controller: 'DialogsCtrl'
                    }
                }
            })
            .state('app.appbrowser', {
                url: "/appbrowser",
                views: {
                    'menuContent': {
                        templateUrl: "templates/plugin/appbrowser.html",
                        controller: 'appBrowserCtrl'
                    }
                }
            })
            .state('app.network', {
                url: "/network",
                views: {
                    'menuContent': {
                        templateUrl: "templates/plugin/network.html",
                        controller: 'NetworkCtrl'
                    }
                }
            })
            .state('app.setting', {
                url: "/setting",
                views: {
                    'menuContent': {
                        templateUrl: "templates/common/setting.html",
                        controller: 'SettingCtrl'
                    }
                }
            })
            //http://stackoverflow.com/questions/21818515/angularjs-nested-states-3-level
            .state('app.wordpress', {
                url: "/wordpress",
                views: {
                    'menuContent': {
                        templateUrl: "templates/wordpress/main.html",
                        controller: 'WordpressCtrl'
                    }
                }
            })
            .state('app.wordpress.news', {
                url: "/news",
                views: {
                    'menuContent@app': {
                        templateUrl: "templates/wordpress/news.html",
                        controller: 'WordpressNewsCtrl'
                    }
                }
            })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/plugins');

    // Use x-www-form-urlencoded Content-Type && X_REQUESTED_WITH
    $httpProvider.defaults.headers.post['Content-Type']         = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type']          = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.common['Content-Type']       = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.common['X_REQUESTED_WITH']   = 'XMLHttpRequest';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    function param(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data, getHeaders) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});
