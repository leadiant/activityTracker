({
    newMaterialItemInstance: function(component, event, helper) {
        
    var materialItem = { 
            sobjectType:'Material_Items__c',
            Source_Type__c : null,
            Item__c : null,
            Item_Description__c : null,
            Amount__c:0,
            Active_Product__c:component.get("v.newTask.Active_Product__c"),
            Quantity__c:1,
            Date_Provided__c:component.get("v.newTask.ActivityDate"),
            Contact__c:component.get("v.newTask.WhoId")
        };
        
        component.set("v.materialItem", materialItem);
    },
    
    setModalBody : function(component, modalBodyComponents){
        $A.createComponents(modalBodyComponents,
			function(newComponents, status, statusMessagesList){
			    console.log("status" + JSON.stringify(statusMessagesList));
                component.set("v.addMaterialItemComponent", newComponents[0]);
                component.get("v.modal").set("v.body", newComponents);
                component.get("v.modal").show();
            });
    },
    
    validate: function(component, event, helper) {
         var isValid = true;
         var today = new Date();

        var dateField = component.find("dueDate");
        var dateValue = dateField.get("v.value");
        var status = component.get("v.newTask.Status");


        var today = new Date();
        var parts = dateValue.split('-');
        var activitydate = new Date(parts[0], parts[1] - 1, parts[2]);

        if ($A.util.isEmpty(dateValue)) {
            isValid = false;
            dateField.showError("Please provide valid Date");
        }
        else {
            dateField.hideError();
        }

        // Status is open and Activity date is lower than today.
        if (status === "Open") {
            if (activitydate < today) {
                isValid = false;
                dateField.showError("Due date for Open status must be today or higher.");
            }
        }

        // Status is Completed and Activity date is greater than today.
        if (status === "Completed") {
            if (activitydate > today) {
                isValid = false;
                dateField.showError("Due date for Completed status must be today or lower.");
            }
        }

        return isValid;
    },
    
    reInitializeMaterialItems: function(component, item) {
        var items = [];
        var items = component.get("v.materialItems");
        items.length = 0
        component.set("v.materialItems", items);
    },
    
     createActivity: function(component) {
        var materialItems = component.get("v.materialItems");
        var task = component.get("v.newTask");

        console.log("task" + JSON.stringify(task));

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

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                toastEvent.fire();
                urlEvent.fire();
            }
            else {
                console.log(response.getState());
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                }

                console.log(response.getReturnValue());
                failureToastEvent.fire();
            }
            
            component.find("spinner").hide();

        });
        component.find("spinner").show();
        $A.enqueueAction(action);
    }
    
})