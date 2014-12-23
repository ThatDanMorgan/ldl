/**
 * This is the main require app.
 */


require.config({
    waitSeconds : 15,
    paths : {
        jquery : 'jquery-1.11.2.min',
        underscore : 'underscore',
        backbone : 'backbone-min',
        handlebars : 'handlebars-v2.0.0'
    },
    shim : {
        underscore : {
            exports : '_'
        },
        backbone : {
            deps : ["underscore", "jquery"],
            exports : "Backbone"
        }
    }
});

require([
  'jquery',
  'underscore',
  'backbone',
  'app/main'  
], function($,_,Backbone,main){
     
    
});
