define([
  "underscore",
  "backbone",
  "mustache.min",
  "app/model/ShipmentModel",
  "app/model/PlacesModel",
  "app/model/BillingModel",
  "text!app/views/TableRowExpanded.html",
  "text!app/views/TableRowExpanded.Contact.html"
],function(_,Backbone,mustache,ShipmentModel,PlacesModel,BillingModel,template,contactTemplate){
  return Backbone.View.extend({
    "className":"ldl_table_expanded_row",
    initialize:function(options){
      var _self = this;
      this.options = options;
      this.model.on("sync",function(){
        _self.loadFurtherData();
      });
    },
    render:function(){
        this.route(this.options);
    },
    route:function(options){
      this.undelegateEvents();
      this.$el.html("<div class='ldl_loading'>Loading...</div>");
      this.model.fetch();
    },
    loadFurtherData:function(){
      var _self = this;
      this.renderData = {
        "main":this.model.attributes
      };

      var otherData = [
        {"model":BillingModel,"key":"billing","id":this.model.get("billing_id")},
        {"model":PlacesModel,"key":"origin","id":this.model.get("origin_id")},
        {"model":PlacesModel,"key":"destination","id":this.model.get("destination_id")}        
      ]
      for(var x in otherData){
         loadData(otherData[x]);        
      }    

      function loadData(options){
        var m = new options.model({'id':options.id});
        m.once("sync",function(){
          _self.renderData[options.key] = m.attributes;
          if(_.keys(_self.renderData).length >= otherData.length){
            _self.renderDisplay();
          }          
        });        
        m.fetch();
      }

      
    },
    renderDisplay:function(){
      var dom = mustache.render(template,this.renderData,{"contact":contactTemplate});
      this.$el.html(dom);
    }    
  });

});