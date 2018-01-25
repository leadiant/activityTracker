({
    setItemAmountAndDescription: function(component) {

        var marketingMaterials = component.get("v.marketingMaterials");
        var item = component.get("v.materialItem.Item__c");
        var marketingMaterial = {};

        marketingMaterial = marketingMaterials.find(function(element) {
            return (element.Id === item)
        });

        component.set('v.materialItem.Amount__c', marketingMaterial.Item_Cost__c);
        component.set('v.materialItem.Item_Description__c', marketingMaterial.Item_Description__c);

    },

    isMarketingMaterialAvilableForProduct: function(component) {
        var isMarketingMaterialAvilable = false;

        var product = component.get("v.materialItem.Active_Product__c");
        console.log("isMarketingMaterialAvilableForProduct" + product);
        var marketingMaterials = component.get("v.marketingMaterials");
        console.log("isMarketingMaterialAvilableForProduct" + marketingMaterials);
        marketingMaterials.forEach(function(record) {
            if (record.Active_Product__c === product) {
                isMarketingMaterialAvilable = true;
            }
        });
    
        console.log("isMarketingMaterialAvilableForProduct");
        return isMarketingMaterialAvilable;
    },


    loadSourceTypeOptions: function(component) {
        var sourceTypes = [
            { class: "optionClass", label: "Educational item", value: "Educational item", selected: true },
            { class: "optionClass", label: "Meal", value: "Meal" },
        ];

        component.set("v.sourceTypes", sourceTypes);
        component.set("v.materialItem.Source_Type__c", "Educational item");
    },

    loadMealSourceType: function(component) {
        var sourceTypes = [
            { class: "optionClass", label: "Educational item", value: "Educational item", disabled: true },
            { class: "optionClass", label: "Meal", value: "Meal", selected: true },
        ];

        component.set("v.sourceTypes", sourceTypes);
        component.set("v.materialItem.Source_Type__c", "Meal");
    },

    loadEductionalItems: function(component) {
        var educationalItems = [];
        var marketingMaterials = component.get("v.marketingMaterials");
        var product = component.get("v.materialItem.Active_Product__c");


        marketingMaterials.forEach(function(record) {

            if (record.Active_Product__c === product) {
                educationalItems.push({
                    label: record.Item_Description__c,
                    value: record.Id,
                });
            }
        });

        component.set("v.educationalItems", educationalItems);
        component.set("v.materialItem.Item__c", educationalItems[0].value);
        this.setItemAmountAndDescription(component);
    },


    validate: function(component) {
       var isValid = true;
       var materialItem = component.get("v.materialItem");
       
       if(!materialItem.Quantity__c || parseInt(materialItem.Quantity__c) === 0){
			component.find("quantity").set('v.validity',{valid:false, valueMissing :true });
			component.find("quantity").showHelpMessageIfInvalid();
            isValid = false;
        }else{
            component.find("quantity").set('v.validity',{valid:true});
        }
        
        if(materialItem.Source_Type__c === "Meal" && (!materialItem.Amount__c || parseInt(materialItem.Amount__c) === 0)){
			component.find("amount").set('v.validity',{valid:false, valueMissing :true });
			component.find("amount").showHelpMessageIfInvalid();
            isValid = false;
        }else{
            component.find("amount").set('v.validity',{valid:true});
        }
        
       component.set("v.isValid", isValid);

    }
})