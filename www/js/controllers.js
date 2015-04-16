angular.module('starter.controllers', [])

.controller('AppCtrl', function($state, $scope, $ionicModal, $timeout) {
    $scope.goPage = function(page)
    {
        $state.go('app.'+page);
    }; 

    //Setting
    $scope.setting = {
        contact : {
            local : true, // Get contacts from device and vise versa (get data defined)
        }
    }
})
.controller('SettingCtrl', function($scope){
})
.controller('PluginsCtrl', function($scope, $ionicModal, $ionicPlatform, $cordovaVibration) {
    
    //Vibration
    $scope.vibration = {
        timeStamp : 300, //default
        showModal : function()
        {
            $ionicModal.fromTemplateUrl('templates/plugin/vibration.html', {
                scope: $scope
            }).then(function(modal) {
                $scope.vibrationModal = modal;
                modal.show();
            }); 
        },
        closeModal : function() {
            $scope.vibrationModal.hide();
        },
        action : function(time)
        {            
            $cordovaVibration.vibrate(time);
        }
    }; 
})
.controller('CameraCtrl', function($scope, $ionicPlatform, $cordovaCamera){

    var image_default = 'http://ecx.images-amazon.com/images/I/41D5vU4I1NL.jpg';

    $scope.error = '';
    $scope.image = '';
    $scope.imageData = '';

    function setImageDefault()
    {
        $scope.image = image_default;
    };

    //First loading
    setImageDefault();

    //Camera
    $ionicPlatform.ready(function() {
        $scope.camera = {
            open : function()
            {       
                var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 720,
                    targetHeight: 1280,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };                 
                $cordovaCamera.getPicture(options).then(function(imageData) {
                    var image = document.getElementById('myImage');
                    $scope.image = image.src = "data:image/jpeg;base64," + imageData;                      
                    $scope.$apply();                            
                }, function(err) {
                    $scope.error = err;
                });                
            },
            reset : function()
            {
                setImageDefault();
            }
        };
    }, false);
})
.controller('DeviceCtrl', function($rootScope, $scope, $stateParams, $state, $ionicPlatform, 
    $cordovaDevice, $cordovaDeviceMotion, $cordovaDeviceOrientation) {
        
    $ionicPlatform.ready(function() {
        $scope.error = '';
        
        //Information
        $scope.deviceInfo = {
            cordova     : $cordovaDevice.getCordova(),
            model       : $cordovaDevice.getModel(),
            flatform    : $cordovaDevice.getPlatform(),
            uuid        : $cordovaDevice.getUUID(),
            version     : $cordovaDevice.getVersion()
        };    
        
        //Motion        
        $scope.motion = {x:'', y:'', z:'', timeStamp:''};
        var options = { frequency: 20000 };
        
        $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
            $scope.motion.x = result.x;
            $scope.motion.y =  result.y;
            $scope.motion.z = result.z;
            $scope.motion.timeStamp = result.timestamp;
        }, function(error) {
            // An error occurred. Show a message to the user
            $scope.error = error;
        });
        
        var watch = $cordovaDeviceMotion.watchAcceleration(options);
        watch.then( null, 
        function(error) {
            // An error occurred
            $scope.error = error;
        },
        function(result) {
            $scope.motion.x = result.x;
            $scope.motion.y = result.y;
            $scope.motion.z = result.z;
            $scope.motion.timeStamp = result.timestamp;
        });

        //watch.clearWatch();
        
        //Orientation
        $scope.orientation = {magneticHeading : '', trueHeading : '', accuracy: '', timeStamp : ''};
        var options = {
            frequency: 3000,
            filter: true     // if frequency is set, filter is ignored
        };
                
        $cordovaDeviceOrientation.getCurrentHeading().then(function(result) {
            $scope.orientation.magneticHeading = result.magneticHeading;
            $scope.orientation.trueHeading = result.trueHeading;
            $scope.orientation.accuracy = result.headingAccuracy;
            $scope.orientation.timeStamp = result.timestamp;            
         }, function(error) {
           // An error occurred
           $scope.error = error;
         });
         
                

        var watch = $cordovaDeviceOrientation.watchHeading(options).then(null,
        function(error) {
            // An error occurred
            $scope.error = error;
        },
        function(result) {   // updates constantly (depending on frequency value)
            $scope.orientation.magneticHeading = result.magneticHeading;
            $scope.orientation.trueHeading = result.trueHeading;
            $scope.orientation.accuracy = result.headingAccuracy;
            $scope.orientation.timeStamp = result.timestamp;
        });
        
        //watch.clearWatch();
    
    }, false);    
})
.controller('ContactsCtrl', function($rootScope, $scope, $stateParams, $state, $ionicModal, $ionicPlatform, $ionicLoading, $ionicScrollDelegate, 
    filterFilter, ContactManager) {
        
    var letters = $scope.letters = [];
    var contacts = $scope.contacts = [];
    var currentCharCode = 'A'.charCodeAt(0) - 1;

    //Get contacts from local
    if($scope.setting.contact.local)
    {
        $ionicPlatform.ready(function() {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> Loading...'
            });
            ContactManager.getAll().then(function(result){
                
                $scope.contacts = result.sort(function(a, b){
                    return a.displayName > b.displayName ? 1 : -1;        
                });  
                
                //Hide Loading
                $ionicLoading.hide();

            }, function(error){
                $scope.error = error;
                $ionicLoading.hide();
            });
        }, false); 
    }
    else
    {    
        //window.CONTACTS is defined below
        window.CONTACTS
            .sort(function(a, b) {
                return a.last_name > b.last_name ? 1 : -1;
            })
            .forEach(function(person) {
                //Get the first letter of the last name, and if the last name changes
                //put the letter in the array
                var personCharCode = person.last_name.toUpperCase().charCodeAt(0);
                //We may jump two letters, be sure to put both in
                //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
                var difference = personCharCode - currentCharCode;
                for (var i = 1; i <= difference; i++) {
                    addLetter(currentCharCode + i);
                }
                currentCharCode = personCharCode;
                person.displayName = person.first_name+' '+person.last_name;
                contacts.push(person);
            });

            //If names ended before Z, add everything up to Z
            for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
                addLetter(i);
            }    
    }

    function addLetter(code) {
        var letter = String.fromCharCode(code);
        contacts.push({
            isLetter: true,
            letter: letter
        });
        letters.push(letter);
    }

    $scope.viewDetail = function()
    {

    };
    
    //Letters are shorter, everything else is 52 pixels
    $scope.getItemHeight = function(item) {
        return item.isLetter ? 40 : 100;
    };
    $scope.getItemWidth = function(item) {
        return '100%';
    };

    $scope.scrollBottom = function() {
        $ionicScrollDelegate.scrollBottom(true);
    };

    var letterHasMatch = {};
    $scope.getContacts = function() {
        letterHasMatch = {};
        //Filter contacts by $scope.search.
        //Additionally, filter letters so that they only show if there
        //is one or more matching contact
        return contacts.filter(function(item) {

            if($scope.setting.contact.local)
            {
                var itemDoesMatch = !$scope.search || item.isLetter ||
                    item.displayName.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

                //Mark this person's last name letter as 'has a match'
                if (!item.isLetter && itemDoesMatch) {
                    var letter = item.displayName.charAt(0).toUpperCase();
                    letterHasMatch[letter] = true;
                }  
            }
            else
            {
                var itemDoesMatch = !$scope.search || item.isLetter ||
                    item.first_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ||
                    item.last_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;

                //Mark this person's last name letter as 'has a match'
                if (!item.isLetter && itemDoesMatch) {
                    var letter = item.last_name.charAt(0).toUpperCase();
                    letterHasMatch[letter] = true;
                }        
            }            

            return itemDoesMatch;
        }).filter(function(item) {
            //Finally, re-filter all of the letters and take out ones that don't
            //have a match
            if (item.isLetter && !letterHasMatch[item.letter]) {
                return false;
            }
            return true;
        });
    };

    $scope.clearSearch = function() {
        $scope.search = '';
    };
    
    $scope.scrollTop = function()
    {
        
    };

})
.controller('DialogsCtrl', function($scope, $stateParams, $cordovaDialogs){
    
    $scope.alert = function()
    {
        $cordovaDialogs.alert('message', 'title', 'button name')
            .then(function() {
                    // callback success
            });
    };
    
    $scope.confirm = function()
    {
        $cordovaDialogs.confirm('message', 'title', ['button 1', 'button 2'])
            .then(function(buttonIndex) {
                // no button = 0, 'OK' = 1, 'Cancel' = 2
                var btnIndex = buttonIndex;
            });
    };
    
    $scope.prompt = function()
    {
        $cordovaDialogs.prompt('msg', 'title', ['btn 1', 'btn 2'], 'default text')
            .then(function(result) {
                var input = result.input1;
                // no button = 0, 'OK' = 1, 'Cancel' = 2
                var btnIndex = result.buttonIndex;
            });
    };
    
    var beepTime = 5; // beep times
    $scope.beep = function()
    {        
        $cordovaDialogs.beep(beepTime);
    }    
})
.controller('appBrowserCtrl', function($rootScope, $scope, $ionicPlatform, $cordovaInAppBrowser){
    
    var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'no'
    };
    $scope.url = 'http://vnexpress.net';
    $scope.msg = '';
    
    $ionicPlatform.ready(function() {
        
        $scope.newTab = function()
        {
            $cordovaInAppBrowser.open($scope.url, '_blank', options)
                .then(function(event) {
                    // success
                })
                .catch(function(event) {
                    // error
                });
        };
    }, false);
  
    //Listenner 
    $rootScope.$on('$cordovaInAppBrowser:loadstart', function(e, event) {
        
    });

    $rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event) {
        // insert CSS via code / file
        $cordovaInAppBrowser.insertCSS({
            code: 'body {background-color:blue;}'
        });

        // insert Javascript via code / file
        $cordovaInAppBrowser.executeScript({
            //file: 'js/script.js'
        });
    });

    $rootScope.$on('$cordovaInAppBrowser:loaderror', function(e, event) {

    });

    $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event) {

    });
})
.controller('GeoCtrl', function($scope, $cordovaGeolocation, $cordovaGlobalization) {
    $scope.error = '';
    $scope.geo = {long : '', lat : ''};    
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(
    function(position) {
        $scope.geo.lat = position.coords.latitude;
        $scope.geo.long = position.coords.longitude;
    }, function(err) {
        $scope.error = err;
    });

    var watchOptions = {
        frequency: 1000,
        timeout: 3000,
        enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(null,
    function(err) {
        // error
        $scope.error = err;
    },
    function(position) {
        $scope.geo.lat = position.coords.latitude;
        $scope.geo.long = position.coords.longitude;
    });
    //watch.clearWatch();
    
    //Globalization
    var global = {
       preferredLanguage : '', 
       localName : '',
       firstDayOfWeek : '',       
    };
    
    $scope.global = global;    
    $scope.globalError = global;
    
    $cordovaGlobalization.getPreferredLanguage().then(
            function(result) {
                $scope.global.preferredLanguage = result;
            },
            function(error) {
                $scope.globalError.preferredLanguage = error;
            });

    $cordovaGlobalization.getLocaleName().then(
            function(result) {
                $scope.global.LocaleName = result;
            },
            function(error) {
                $scope.globalError.localeName = error;
            });

    $cordovaGlobalization.getFirstDayOfWeek().then(
            function(result) {
                $scope.global.firstDayOfWeek = result;
            },
            function(error) {
                $scope.globalError.firstDayOfWeek = error;
            });
})
.controller('NetworkCtrl', function($rootScope, $scope, $ionicPlatform, $cordovaNetwork){
    $scope.error = '';
    
    $scope.network = {
        typeNetwork : '',
        isOnline : false,
        isOffline: false,
        onlineState : '',
        offlineState : ''
    };
    
    $ionicPlatform.ready(function() {           
        $scope.network.typeNetwork= $cordovaNetwork.getNetwork();

        $scope.network.isOnline = $cordovaNetwork.isOnline();

        $scope.network.isOffline = $cordovaNetwork.isOffline();

        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
          $scope.network.onlineState = networkState;
        });

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
          $scope.network.offlineState = networkState;
        });
        
    }, false);
});
