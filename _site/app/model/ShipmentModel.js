/** 
 * BACKBONE MODEL: Shipment
 * Unlike the ShipmentCollection this model reads from the `shipments.json`
 * file which contains more in depth shipment data.  The upshot is that
 * when this model is built (via the collection) it has enough information
 * to be rendered, and then the app can use its `fetch()` to finish the call.
 */
define([
  "underscore",
  "backbone",  
],function(_,Backbone){
  return Backbone.Model.extend({
    "url":"data/shipments.json",        
    "parse":function(data){
      if(_.isArray(data)){
        data = _.findWhere(data,{"id":this.get("id")});        
      }
      return data;
    }

  });

});