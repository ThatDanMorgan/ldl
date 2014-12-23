var XLSX = require('xlsx');
var fs = require('fs');
var _ = require('underscore');

var workbook = XLSX.readFile('data.xlsx');

var worksheet = workbook.Sheets["Sheet1"];

var raw = XLSX.utils.sheet_to_json(worksheet);

var SHIPMENTS = [];
var PLACES = [];
var CONTACTS = [];
var CARRIERS = [];
var BROKERS = [];
var BILLING = [];
var SHIPMENTS_DISPLAY = [];


var TRANSLATIONS = {
    "billing":{
        "BillTo_CityName": "city_name",
        "BillTo_CountryCode": "country_code",
        "BillTo_PostalCode": "postal_code",
        "BillToAddress1": "address1",
        "BillToAddress2": "address2",
        "BillToName": "name",
        "BillToStateCode": "state_code",   
        "BillToFaxNo":"fax",     
    },
    "broker":{
        "BrokerCarrierCode":"broker_carrier_code",
        "BrokerReferenceNo":"broker_reference_number"

    },
    "carrier":{
        "CarrierID": "id",
        "CarrierName": "name",
        "CarrierNotes":"notes",
        "CarrierType":"type"
    },
    "destination":{
        "DestContactPerson": "contact",
        "DestContactPhone": "phone",
        "DestEmail": "email",
        "DestFaxNo":"fax",
        "Destination_Address1": "address1",
        "Destination_Address1": "address2",
        "Destination_CityName": "city_name",
        "Destination_CountryCode": "country_code",
        "Destination_Name": "name",
        "Destination_StateCode": "state_code"
    },
    "destination_terminal":{        
        "DestTerminalAdd1": "address1",
        "DestTerminalAdd2": "address2",
        "DestTerminalCity": "city_code",
        "DestTerminalContactPerson": "contact",
        "DestTerminalEmail": "email",
        "DestTerminalFax": "fax",
        "DestTerminalName": "name",
        "DestTerminalPhone": "phone",
        "DestTerminalFreePhone": "free_phone",
        "DestTerminalState": "state_code",
        "DestTerminalZip": "postal_code"
    },
    "origin":{
        "Origin_Address1": "address1",
        "Origin_Address2": "address2",
        "Origin_Name": "name",
        "Origin_PostalCode": "postal_code",
        "Origin_StateCode": "state_code",
        "Origin_CityName": "city_name",
        "Origin_CountryCode": "country_code",
        "OrgFaxNo":"fax",
        "OriginContactPerson": "contact",
        "OriginContactPhone": "phone",
        "OriginEmail": "email",
    },
    "origin_terminal":{
        "OriginTerminalFax":"fax",
        "OriginTerminalAdd1": "address1",
        "OriginTerminalAdd2": "address2",
        "OriginTerminalCity": "city_code",
        "OriginTerminalContactPerson": "contact",
        "OriginTerminalFax":"fax",
        "OriginTerminalEmail": "email",
        "OriginTerminalName": "name",
        "OriginTerminalFreePhone":"free_phone",
        "OriginTerminalPhone": "phone",
        "OriginTerminalState": "state_code",
        "OriginTerminalZip": "postal_code",
    },
    "shipment":{
        "AccountDescription":"account_description",
        "AddDate":"date_added",
        "AddedBy":"added_by",
        "AccsCost": "accs_cost",
        "ClientName": "client_name",
        "ConsigneeNotes":"consignee_notes",
        "CreatedBy": "created_by",
        "CreatedDate": "created_date",
        "CustRefNo":"cust_ref_no",
        "DeliveryDate": "delivery_date",
        "DeliveryTime":"delivery_time",
        "EdiGeneratedDate":"edi_generated_date",
        "EDItransactionNo":"edi_transaction_number",
        "EqpType":"equipment_type",
        "EquipmentDescription": "equipment_description",
        "FreightCost": "freight_cost",
        "FuelCost": "fuel_cost",
        "Load Number": "load_number",
        "Miles": "miles",
        "ModifiedBy": "modified_by",
        "ModifiedDate": "modified_date",
        "PickupDate": "pickup_date",
        "PickupTime":"pickup_time",
        "PONumber":"po_number",
        "QuoteDate":"quote_date",
        "QuoteNumber":"quote_number",
        "PriorityDescription": "priority_description",
        "ProNumber": "pro_number",
        "Ref1": "ref_1",
        "Ref2":"ref_2",
        "Ref3":"ref_3",
        "RequestedDeliveryDate":"requested_delivery_date",
        "RequestedDeliveryTime":"requested_delivery_time",
        "RequestedPickupDate": "requested_pickup_date",
        "RequestedPickupTimeFrom": "requested_pickup_from",
        "RequestedPickupTimeTo": "requested_pickup_to",
        "ServiceLevel":"service_level",
        "ShipCost": "ship_cost",
        "ShipmentStatus": "status",
        "ShipperNotes":"shipper_notes",
        "SONumber":"SONumber",
        "SplNotes":"spl_notes",
        "TransitDays":"transit_days",
        "TransTime": "transit_time",
        "Number of Records": "num_records",
    },
    "shipment_display":{
        "DeliveryDate": "delivery_date",
        "DeliveryTime":"delivery_time",
        "Load Number": "id",
        "Miles": "miles",
        "PickupDate": "pickup_date",
        "PickupTime":"pickup_time",
        "FreightCost": "freight_cost",
        "FuelCost": "fuel_cost",        
        "TransitDays":"transit_days",
        "TransTime": "transit_time",      
        "Origin_Name": "origin_name",
        "Origin_PostalCode": "origin_postal_code",
        "Origin_StateCode": "origin_state_code",
        "Origin_CityName": "origin_city_name",
        "Origin_CountryCode": "origin_country_code",  
        "Destination_CityName": "destination_city_name",
        "Destination_CountryCode": "destination_country_code",
        "Desintation_PostalCode": "destination_postal_code",
        "Destination_Name": "destination_name",
        "Destination_StateCode": "destination_state_code",
        "ShipmentStatus": "status",

    }
    
}

    function createUniqueId(){
        return Math.floor(Math.random() * new Date().getTime()).toString(36);
    }


function mapToDB(dataTable,inObj){
    
    var obj = _.findWhere(dataTable,inObj);
    if(!obj){
        obj = inObj;
        obj.id = obj.id || createUniqueId();
        dataTable.push(obj);
    }       
    return obj.id;
}

function createObject(data,translationKey){
    var translation = TRANSLATIONS[translationKey];
    var obj = {};
    for(var x in translation){
        obj[translation[x]] = data[x];
    }
    return obj;
}

function createAndMapObject(dataTable,translationKey,data){
    var obj = createObject(data,translationKey);
    return mapToDB(dataTable,obj);
} 


function blockData(row,key){
    if(row[key]) row[key] = "BLOCKED";
}



for(var x = 0; x < raw.length; x++){
    var row = raw[x];
    blockData(row,"BillToName")
    blockData(row,"BillToFaxNo")
    blockData(row,"DestContactPerson")
    blockData(row,"DestContactPhone")
    blockData(row,"DestEmail")
    blockData(row,"DestFaxNo")
    blockData(row,"DestTerminalContactPerson")
    blockData(row,"DestTerminalEmail")
    blockData(row,"DestTerminalFax")
    blockData(row,"DestTerminalPhone")
    blockData(row,"DestTerminalFreePhone")
    blockData(row,"OrgFaxNo")
    blockData(row,"OriginContactPerson")
    blockData(row,"OriginContactPhone")
    blockData(row,"OriginEmail")
    blockData(row,"OriginTerminalFax")
    blockData(row,"OriginTerminalContactPerson")
    blockData(row,"OriginTerminalFax")
    blockData(row,"OriginTerminalEmail")
    blockData(row,"OriginTerminalName")
    blockData(row,"OriginTerminalFreePhone")
    blockData(row,"OriginTerminalPhone")
    blockData(row,"CreatedBy")
    blockData(row,"Ref1")
    blockData(row,"Ref2")
    blockData(row,"Ref3")
    
    row.FuelCost = x + .99;
    row.FreightCost = x + .11;


    var shipment = createObject(row,"shipment");    
    
    shipment.origin_terminal_id = createAndMapObject(PLACES,"origin_terminal",row);
    shipment.destination_terminal_id = createAndMapObject(PLACES,"destination_terminal",row);
    shipment.origin_id = createAndMapObject(PLACES,"origin",row);
    shipment.destination_id = createAndMapObject(PLACES,"destination",row);

    shipment.billing_id = createAndMapObject(BILLING,"billing",row);
    shipment.broker_id = createAndMapObject(BROKERS,"broker",row);
    shipment.carrier_id = createAndMapObject(CARRIERS,"carrier",row);
    shipment.contact_id = createAndMapObject(CONTACTS,"contact",row);    
    


    shipment.id = shipment.load_number;    
    SHIPMENTS.push(shipment);
    
    createAndMapObject(SHIPMENTS_DISPLAY,"shipment_display",row);
    
}

var allData = {
    "shipments":SHIPMENTS,
    "places":PLACES,
    "billing":BILLING,
    "brokers":BROKERS,
    "carriers":CARRIERS,
    "contacts":CONTACTS
       
}



function writeFile(filename,data){
    fs.writeFile(filename,JSON.stringify(data,null,4),function(err){
      if(err){
        console.log(filename + "\t[ERROR] Could not write file.");  
      }else{
        console.log(filename + "\t[SUCCESS] File  written.");  
      }
    });    
}


writeFile("data.json",allData);
writeFile("shipments.json",SHIPMENTS);
writeFile("shipment_display.json",SHIPMENTS_DISPLAY);
writeFile("places.json",PLACES);
writeFile("billing.json",BILLING);
writeFile("brokers.json",BROKERS);
writeFile("carriers.json",CARRIERS);
writeFile("contacts.json",CONTACTS);
