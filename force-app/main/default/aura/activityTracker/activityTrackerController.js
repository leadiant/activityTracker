({
    doInit: function (component, event, helper) {
        component.set("v.modal", component.find("newMaterialItemModal"));
        helper.newTaskInstance(component);
        helper.getOptions(component, event, helper);
    },


    getContactInfo: function (component, event, helper) {

        var contactId = component.get('v.newTask.WhoId');

        if (!contactId) {
            component.set('v.selectedAccountName', null);
            component.set('v.productOptions', null);
            component.set('v.newTask.Active_Product__c', null);
            return;
        }

        var getRecordsAction = component.get('c.getContactDetails');

        getRecordsAction.setParams({
            jsonString: JSON.stringify({
                contactId: contactId
            })
        });

        getRecordsAction.setCallback(this, function (res) {
            if (res.getState() === 'SUCCESS') {
                var returnValue = JSON.parse(res.getReturnValue());

                if (returnValue.isSuccess) {
                    component.set('v.productOptions', returnValue.results.data);
                    component.set('v.newTask.Active_Product__c', returnValue.results.data[0].value);
                    component.set('v.newTask.WhatId', returnValue.results.accountId);
                } else {
                    component.find('toaster').show('Warning!', 'failure', returnValue.errMsg);
                }
            }

        });

        $A.enqueueAction(getRecordsAction);
    },

    handleClickOpenModal: function (component, event, helper) {
        helper.newMaterialItemInstance(component);

        var newModalBody = [
            ["c:activityTracker_newMaterialItem", {
                newMaterialItem: component.getReference("v.newMaterialItem"),
                sourceTypeOptions: component.getReference("v.sourceTypeOptions"),
                marketingMaterials: component.getReference("v.marketingMaterials")
            }]
        ];
        helper.setModalBody(component, newModalBody);
    },

    handleCreateMaterialItem: function (component, event, helper) {
        var newMaterialItem = component.get("v.newMaterialItem");
        var newMaterialItems = component.get("v.newMaterialItems");
        component.get("v.addMaterialItemComponent").validate();
        if (component.get("v.addMaterialItemComponent").get("v.isValid")) {
            newMaterialItems.push(newMaterialItem);
            component.set("v.newMaterialItems", newMaterialItems);
            component.get("v.modal").hide();
        }
    },

    handleClearClick: function (component, event, helper) {
        var index = event.getSource().get("v.value");

        var newMaterialItems = component.get("v.newMaterialItems");
        newMaterialItems.splice(index, 1);
        component.set("v.newMaterialItems", newMaterialItems);
    },

    handleClickCancel: function (component, event, helper) {

        if (component.get("v.recordId") != undefined && component.get("v.recordId") != null) {
            var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": "/" + component.get("v.recordId")
            });
            urlEvent.fire();
        } else {
            var evt = $A.get("e.force:navigateToComponent");
            evt.setParams({
                componentDef: "c:activityTracker",
                componentAttributes: {}
            });

            evt.fire();
        }


    },

    handleClickSave: function (component, event, helper) {
       // var helper = this;
        var action = component.get("c.insertActivity");

        action.setParam("task", component.get("v.newTask"));
        action.setParam("materialItems", component.get("v.newMaterialItems"));
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var returnValue = JSON.parse(response.getReturnValue());
                if (returnValue.isSuccess) {
                    component.find('toaster').show('Success!', 'success', 'Activity is logged!');
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": "/" + component.get("v.newTask.WhoId")
                    });
                    urlEvent.fire();
                } else {
                    component.find('toaster').show('Failed!', 'failure', 'There was a problem logging your Activity. Please contact HelpDesk.');
                }
            } else if (component.isValid() && state === "ERROR") {
                component.find('toaster').show('Failed!', 'failure', 'There was a problem logging your Activity. Please contact HelpDesk.');
            }
            component.find("spinner").hide();
        });
        if (helper.validate(component)) {
            component.find("spinner").show();
            $A.enqueueAction(action);
        }
    },



    handleTaskStatusChange: function (component, event, helper) {
        console.log('handleTaskStatusChange - entry');
        var status = component.get("v.newTask.Status");

        if (status === "Open") {
            component.set("v.newMaterialItems.length", 0);
        }
    },


})