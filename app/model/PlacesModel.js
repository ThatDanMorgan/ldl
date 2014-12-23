define([
  "underscore",
  "backbone",  
],function(_,Backbone){
  return Backbone.Model.extend({
    "url":"data/places.json",        
    "parse":function(data){
      if(_.isArray(data)){
        data = _.findWhere(data,{"id":this.get("id")});        
      }
      return data;
    }

  });

});