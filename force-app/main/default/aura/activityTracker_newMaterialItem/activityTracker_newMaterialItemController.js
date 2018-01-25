({
    doInit: function (component, event, helper) {
        var product = component.get('v.newMaterialItem.Active_Product__c');
        var marketingMaterials = component.get("v.marketingMaterials");

        if (marketingMaterials.find(record => record.product === product) != undefined) {
            component.set('v.marketingMaterialsOptions', marketingMaterials.find(record => record.product === product).values);
            component.set('v.newMaterialItem.Source_Type__c', 'Educational item');
        } else {
            component.get("v.sourceTypeOptions").find(record => record.label === 'Educational item').disabled = true;
            component.set('v.newMaterialItem.Source_Type__c', 'Meal');
        }

    },


    handleEducationalItemChange: function (component, event, helper) {
        helper.setItemAmountAndDescription(component);
    },

    handleSourceTypeChange: function (component, event, helper) {
        var sourceType = component.get("v.newMaterialItem.Source_Type__c");
        var marketingMaterialsOptions = component.get("v.marketingMaterialsOptions");
        if (sourceType === "Educational item") {
            component.find("marketingMaterialsItemSelect").set("v.value", marketingMaterialsOptions[0].Id);
        } else {
            component.set('v.newMaterialItem.Amount__c', 0);
            component.set('v.newMaterialItem.Quantity__c', 1);
            component.set('v.newMaterialItem.Item__c', "");
            component.set('v.newMaterialItem.Item_Description__c', "");
        }

    },

    validateNewMaterialItem: function (component) {
        var isValid = true;
        var newMaterialItem = component.get("v.newMaterialItem");

        if (!newMaterialItem.Quantity__c || parseInt(newMaterialItem.Quantity__c) === 0) {
            component.find("quantity").set('v.validity', {
                valid: false,
                valueMissing: true
            });
            component.find("quantity").showHelpMessageIfInvalid();
            isValid = false;
        } else {
            component.find("quantity").set('v.validity', {
                valid: true
            });
        }

        if (newMaterialItem.Source_Type__c === "Meal" && (!newMaterialItem.Amount__c || parseInt(newMaterialItem.Amount__c) === 0)) {
            component.find("amount").set('v.validity', {
                valid: false,
                valueMissing: true
            });
            component.find("amount").showHelpMessageIfInvalid();
            isValid = false;
        } else {
            component.find("amount").set('v.validity', {
                valid: true
            });
        }


        component.set("v.isValid", isValid);

    }

})