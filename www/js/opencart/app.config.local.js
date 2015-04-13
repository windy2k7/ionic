
var baseConfig = (function() {
    var config = {};
    config.env = 'development';
    config.protocol = 'http://'; 
    config.apiUrlDev = config.protocol+window.location.hostname+'/opencart-1.5.6/api.php';
    config.apiUrlBuild = 'http://192.168.0.100/opencart-1.5.6/api.php';
    config.tplPath = 'templates/';
    config.relatedProduct = 2;
    config.getApiUrl = function(){ return  config.env === 'developmentx' ? config.apiUrlDev : config.apiUrlBuild };    
    return config;
}());
