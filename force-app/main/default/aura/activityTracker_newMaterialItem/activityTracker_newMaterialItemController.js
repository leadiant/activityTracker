({
    doInit: function(component, event, helper) {
        console.log("Do Init Called");
        var marketingMaterialService = component.find("marketingMaterialService");
        marketingMaterialService.getActiveMarketingMaterials($A.getCallback(function(error,data) {
            console.log(data);
            component.set("v.marketingMaterials", data);
            console.log(component.get("v.marketingMaterials"));
            if(helper.isMarketingMaterialAvilableForProduct(component)) {
                helper.loadSourceTypeOptions(component);
                helper.loadEductionalItems(component);
            } else {
                helper.loadMealSourceType(component);
            }
            
             helper.validate(component);
            
        }));
    },

    handleEducationalItemChange: function(component, event, helper) {
        helper.setItemAmountAndDescription(component);
    },
    
    handleChangeEvent : function (component, event, helper){
        helper.validate(component);
    },
    
     handleSourceTypeChange: function(component, event, helper) {
        var sourceType = component.get("v.materialItem.sourceType");

        if (sourceType === "Educational item") {
            var educationalItems = component.get("v.educationalItems");
            component.set("v.Item__c", educationalItems[0].value);
            helper.setItemAmountAndDescription(component);
        }
        else {
            component.set('v.materialItem.Amount__c', 0);
            component.set('v.materialItem.Quantity__c', 1);
            component.set('v.materialItem.Item__c', "");
            component.set('v.materialItem.Item_Description__c', "");
        }
        
         helper.validate(component);
    },
})