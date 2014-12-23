define([
  "underscore",
  "backbone",
  "mustache.min",
  "app/model/ShipmentCollection",
  "app/views/TableRowExpanded",
  "text!app/views/TableView.html"
],function(_,Backbone,mustache,ShipmentCollection,TableRowExpanded,template){
  return Backbone.View.extend({
    events:{
      "click button[name=expand_row]":"clickEvent"
    },
    initialize:function(options){
      this.options = options;
      this.collection = new ShipmentCollection();
    },
    render:function(){
        this.route(this.options)
    },
    route:function(options){      
      var _self = this;
      options = options || {};      
      this.undelegateEvents();
      this.$el.html("<div class='ldl_loading'>Loading...</div>");
      var filter = _.clone(options);
      delete filter.view;
      this.collection.fetch({"filter":options});
      this.collection.once("sync",function(){_self.renderList()});
    },
    renderList:function(){
      var rawData = this.collection.toJSON();
      var dom = mustache.render(template,{"data":rawData});
      this.$el.html(dom);
      if(rawData.length == 1){
        this.expandRow(rawData[0].id);
      }

      this.delegateEvents();
    },
    clearExpandedRow:function(){
        this.expandedRow.removeClass("expanded");
        this.expandedRowView.remove();
    },    
    clickEvent:function(event){
      var ele = $(event.currentTarget);
      var rowid = ele.data("row-id");
      this.expandRow(rowid);      
    },
    expandRow:function(rowid){
      var row = this.$("*[data-row-id='" + rowid + "']");
            
      if(this.expandedRow && this.expandedRow[0] != row[0]){
        this.clearExpandedRow();
      }
      if(row.hasClass("expanded")){
        this.clearExpandedRow();
      }else{
        this.expandedRow = row;
        var model = this.collection.get(rowid);
        this.expandedRowView = new TableRowExpanded({"model":model});
        this.expandedRowView.render();
        row.find(".expanded_content").html(this.expandedRowView.$el);
        row.addClass("expanded");

      }      
    }

  });

});