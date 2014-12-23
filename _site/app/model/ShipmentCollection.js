define([
  "underscore",
  "backbone",  
  "app/model/ShipmentModel"
],function(_,Backbone,ShipmentModel){    
  return Backbone.Collection.extend({
    "model":ShipmentModel,
    "url":"data/shipment_display.json",
    /**
     * This parse() exists to similate the filter operation expected on
     * the actual live API.  
     */
    "parse":function(data,options){
        if(options.filter){
            var filter = [];
            _.forEach(options.filter,function(term,key){
                var regex = RegExp(term,"i");
                if(key == "id"){                                        
                    filter.push(function(item){
                        return regex.test(item.id);   
                    });                                    
                }else if(key == "location"){
                    filter.push(function(item){
                        return regex.test(item.origin_name) || regex.test(item.destination_name);
                    });
                }else if(key == "city"){
                    filter.push(function(item){
                        return regex.test(item.origin_city_name) || regex.test(item.destination_city_name);
                    });
                }
            });
            
            var finalData = [];
            for(var x = 0; x < data.length; x++){
                var ok = true;
                var item = data[x];
                for(var f = 0; f < filter.length; f++){
                    if(!filter[f](item)) ok = false;
                }
                if(ok) finalData.push(item);
            }
            data = finalData;

        }
        return data;
    }

  });

});