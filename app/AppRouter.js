define([
  "underscore",
  "backbone",
  "app/views/TableView"
],function(_,Backbone,TableView){    
    var Router =  Backbone.Router.extend({
        "viewConstructors":{
          "all":TableView
        },
        initialize:function(){
          this.container = $(".ldl_main_container");
        },
        routes:{
          '*data':"replay",
          '':"replay"
        },
        replay:function(actions){
            var map = new ParmMap(actions);
            
            if(this.currMap == null || !_.isEqual(map,this.currMap)){
                this.currMap = map;
                var view = map.get("view") || "all";
                if(this.viewName != view && this.viewConstructors[view]){
                    this.viewName = view;
                    // If a view exists, destroy it.
                    if(this.view) this.view.remove();                    
                    // change views                     
                    this.view = new this.viewConstructors[view](map.get());
                    this.view.render();
                    this.container.html(this.view.$el);
                }else{
                    this.view.route(map.get());
                }

            }



        }
    });
    
    function ParmMap(string){
        string = string || window.location.hash.substring(1);
        this.map = {};
        var keyvaluepairs = string.split("&");
        for(var x = 0; x < keyvaluepairs.length; x++){
              var split = keyvaluepairs[x].split("=");
              this.set(split[0],window.decodeURIComponent(split[1]));
        }
    }

    ParmMap.prototype = {      
      set:function(key,value){
        if(_.isObject[arguments[0]]){
          _.extend(this.map,arguments[0]);
        }else{
          this.map[arguments[0]] = arguments[1];          
        }
        return arguments[1] || arguments[0];
      },
      get:function(key){
        if(key){
          return this.map[key]  
        }
        return this.map;        
      },
      toString:function(){
          var arr = [];
          for(var x in this.map){
            arr.push(x + "=" + window.encodeURIComponent(this.map[x]));
          }
          return arr.join("&");
      }
    };


    Router.getParameters = function(){
        return new ParmMap();
    }


    return Router;

});