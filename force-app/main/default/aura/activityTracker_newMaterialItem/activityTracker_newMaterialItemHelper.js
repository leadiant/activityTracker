({
    setItemAmountAndDescription: function (component) {
        var sourceType = component.get("v.newMaterialItem.Source_Type__c");
        if (sourceType === "Educational item") {
            var marketingMaterialsOptions = component.get("v.marketingMaterialsOptions");
            var item = component.get("v.newMaterialItem.Item__c");
            var marketingMaterial = {};

            marketingMaterial = marketingMaterialsOptions.find(function (element) {
                return (element.Id === item)
            });

            component.set('v.newMaterialItem.Amount__c', marketingMaterial.Item_Cost__c);
            component.set('v.newMaterialItem.Item_Description__c', marketingMaterial.Item_Description__c);
        }

    },

})