define([
  "underscore",
  "backbone",  
],function(_,Backbone){
  return Backbone.Model.extend({
    "url":"data/billing.json",
    "parse":function(data){
      if(_.isArray(data)){
        data = _.findWhere(data,{"id":this.get("id")});        
      }
      return data;
    }

  });

});