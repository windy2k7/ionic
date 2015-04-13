
var baseConfig = (function() {
    var config = {};
    config.env = 'development';
    config.protocol = 'http://'; 
    config.apiUrlDev = config.protocol+window.location.hostname+'/opencart-1.5.6/api.php';
    config.apiUrlBuild = 'http://192.168.0.100/opencart-1.5.6/api.php';
    config.tplPath = 'templates/';
    config.relatedProduct = 2;
    config.getApiUrl = function(){ return  config.env === 'development' ? config.apiUrlDev : config.apiUrlBuild };    
    return config;
}());

var wpConfig = (function() {
    var config = {};
    config.env = 'development';
    config.tplPath = 'wordpress/';    
    config.protocol = 'http://'; 
    config.apiUrlDev = config.protocol+window.location.hostname+'/wordpress/?json=';
    config.apiUrlBuild = 'http://192.168.0.100/wordpress/?json=';    
    config.apiUrl = this.env === 'development' ? this.apiUrlDev : this.apiUrlBuild;   
    config.api = {
    	recentPost : config.apiUrlDev+'get_recent_posts',
    };
    return config;
}());

