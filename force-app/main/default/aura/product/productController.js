({
    populateValues: function(component, event, helper) {
        //   component.find("select").hideError();
       // helper.hideError(component);
        var params = event.getParam("arguments");
        var contactRecordLoader = component.find("contactRecordLoader");
        contactRecordLoader.set("v.recordId", params.contactId);
        contactRecordLoader.reloadRecord();

    },

    //This method will be called by force recorddata after the contact is loaded.
    handleContactRecordLoaded: function(component, event, helper) {
        helper.hideError(component);
        var eventParams = event.getParams();
        var productOptions = [];
        component.set("v.productOptions", productOptions);
        component.set("v.productValue", null);
        var contactProduct;

        if (eventParams.changeType === "LOADED") {
            contactProduct = component.get("v.selectedContact.fields.Active_Product__c.value");
            if (contactProduct != undefined && contactProduct != null) {
                contactProduct.split(";").forEach(function(record) {
                    productOptions.push({
                            "class": "optionClass",
                            label: record,
                            value: record,
                        }

                    );
                });
                component.set("v.productOptions", productOptions);
                component.set("v.productValue", productOptions[0].value);
            }
            else {
                helper.showError(component);
                
            }
        }

    },
    

})