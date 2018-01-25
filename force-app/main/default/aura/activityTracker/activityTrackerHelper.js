({
    newMaterialItemInstance: function (component) {

        var newMaterialItem = {
            sobjectType: "Material_Items__c",
            Contact__c: component.get("v.newTask.WhoId"),
            Item__c: null,
            Source_Type__c: null,
            Item_Description__c: null,
            Date_Provided__c: component.get("v.newTask.ActivityDate"),
            Active_Product__c: component.get("v.newTask.Active_Product__c"),
            Quantity__c: 1,
            Amount__c: 0
        };

        component.set("v.newMaterialItem", newMaterialItem);
    },


    getOptions: function (component, event, helper) {

        var getOptionsAction = component.get('c.getPicklistValues');

        getOptionsAction.setCallback(this, function (res) {
            if (res.getState() === 'SUCCESS') {
                var returnValue = JSON.parse(res.getReturnValue());
                if (returnValue.isSuccess) {
                    component.set('v.statusOptions', returnValue.results.data.find(record => record.field === 'Status').values);
                    component.set('v.subjectOptions', returnValue.results.data.find(record => record.field === 'Subject').values);
                    component.set('v.callTypeOptions', returnValue.results.data.find(record => record.field === 'CallType').values);
                    component.set('v.typeOfCallOptions', returnValue.results.data.find(record => record.field === 'TypeOfCall').values);
                    component.set('v.scientificTopicOptions', returnValue.results.data.find(record => record.field === 'ScientificTopic').values);
                    component.set('v.sourceTypeOptions', returnValue.results.data.find(record => record.field === 'SourceType').values);
                    component.set('v.marketingMaterials', returnValue.results.marketingMaterials);
                }
            }

        });

        $A.enqueueAction(getOptionsAction);
    },

    newTaskInstance: function (component) {
        var recordId = component.get("v.recordId");
        var today = new Date();
        var contactId = null;


        if (recordId != undefined && recordId != null) {
            contactId = recordId;
        }

        var newTask = {
            sobjectType: "Task",
            WhoId: contactId,
            WhatId: null,
            Priority: 'Normal',
            Status: 'Completed',
            Subject: 'Call',
            Call_Type__c: 'In-Person Visit',
            ActivityDate: today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2),
            ONC_Type_Call__c: 'Branded',
            Active_Product__c: null,
            ONC_Scientific_Topic__c: null
        };
        component.set("v.newTask", newTask);

    },

    setModalBody: function (component, modalBodyComponents) {
        $A.createComponents(modalBodyComponents,
            function (newComponents, status, statusMessagesList) {
                component.set("v.addMaterialItemComponent", newComponents[0]);
                component.get("v.modal").set("v.body", newComponents);
                component.get("v.modal").show();
            });
    },

    validate: function (component, event, helper) {
        var newTask = component.get("v.newTask");
        var isValid = true;
        //        var today = new Date();

        //      var dateField = component.find("dueDate");
        //    var dateValue = dateField.get("v.value");
        //  var status = component.get("v.newTask.Status");


        var today = new Date();
        var activityDateParts = newTask.ActivityDate.split('-');
        var activitydate = new Date(activityDateParts[0], activityDateParts[1] - 1, activityDateParts[2]);

        if ($A.util.isEmpty(newTask.ActivityDate)) {
            isValid = false;
            component.find("dueDate").showError("Please provide valid Due Date");
        } else {
            component.find("dueDate").hideError();
        }

        // Status is open and Activity date is lower than today.
        if (newTask.Status === "Open") {
            if (activitydate < today) {
                isValid = false;
                component.find("dueDate").showError("Due date for Open status must be today or higher.");
            }
        }

        // Status is Completed and Activity date is greater than today.
        if (status === "Completed") {
            if (activitydate > today) {
                isValid = false;
                component.find("dueDate").showError("Due date for Completed status must be today or lower.");
            }
        }

        return isValid;
    },

    createActivity: function (component) {
        var materialItems = component.get("v.materialItems");
        var task = component.get("v.newTask");



        var action = component.get("c.saveActivity");
        action.setParams({
            "task": task,
            "materialItems": materialItems
        });


        var failureToastEvent = $A.get("e.force:showToast");
        failureToastEvent.setParams({
            "title": "Failed!",
            "message": "There was a problem logging your Activity. Please contact HelpDesk.",
            "type": "failure"
        });


        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "Activity is logged!",
            "type": "success"
        });

        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/" + task.WhoId
        });

        action.setCallback(this, function (response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                toastEvent.fire();
                urlEvent.fire();
            } else {

                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {

                    }
                }


                failureToastEvent.fire();
            }

            component.find("spinner").hide();

        });
        component.find("spinner").show();
        $A.enqueueAction(action);
    }

})