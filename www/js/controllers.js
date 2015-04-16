angular.module('starter.controllers', [])

.controller('AppCtrl', function($state, $scope, $ionicModal, $timeout) {
    $scope.goPage = function(page)
    {
        $state.go('app.plugins.'+page);
    }; 

    //Setting
    $scope.setting = {
        contact : {
            local : true, // Get contacts from device and vise versa (get data defined)
        }
    }
})
.controller('SettingCtrl', function($scope){
});

