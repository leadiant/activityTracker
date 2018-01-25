({
    doInit: function(component, event, helper) {
        var recordId = component.get("v.recordId");

        if (recordId != undefined && recordId != null) {
            console.log("recordId if" + recordId);
            component.set("v.newTask.WhoId",recordId);
            component.find("product").populateContactProducts(recordId);
        }
        
        var today = new Date();
        component.set("v.modal", component.find("newMaterialItemModal"));
        component.set("v.newTask.ActivityDate", today.getFullYear() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2));

        var taskDataService = component.find("taskDataService");
        taskDataService.getTaskPicklistValues($A.getCallback(function(error, data) {
            component.set("v.taskPicklistValues", data);
            component.set("v.marketingMaterials", data.marketingMaterials);

        }));
    },

    getContactProduct: function(component, event, helper) {
        component.find("product").populateContactProducts(component.get("v.newTask.WhoId"));
        
    },
    
    handleClickOpenModal: function(component, event, helper) {
        helper.newMaterialItemInstance(component);
        var newModalBody = [
            ["c:activityTracker_newMaterialItem", {
                materialItem: component.getReference("v.materialItem")
            }]
        ];
        helper.setModalBody(component, newModalBody);
    },
    
    handleCreateMaterialItem:function(component, event, helper) {
       var materialItem = component.get("v.materialItem");
        var materialItems = component.get("v.materialItems");
       if(component.get("v.addMaterialItemComponent").get("v.isValid")){
			 materialItems.push(materialItem);
			 component.set("v.materialItems", materialItems);
    	    component.get("v.modal").hide();
       }
    },
    
     handleClearClick: function(component, event, helper) {
        var index = event.getSource().get("v.value");

        var materialItems = component.get("v.materialItems");
        materialItems.splice(index, 1);
        component.set("v.materialItems", materialItems);
    },
    
     handleClickCancel: function(component, event, helper) {
        //reset form Elements
/*        var items = component.get("v.materialItems");

        component.set("v.newTask.WhoId", null);
        component.set("v.selectedAccountName", null);
        component.set("v.newTask.Active_Product__c", null);

        items.length = 0;
        component.set("v.materialItems", items);
  */      
        
     /*    var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": "/one/one.app?Log_A_Call_v2"
        });
        urlEvent.fire();
       */ 
    //    window.location.href = "/one/one.app?Log_A_Call_v2";
    
		
		if (component.get("v.recordId") != undefined && component.get("v.recordId") != null) {
    		var urlEvent = $A.get("e.force:navigateToURL");
            urlEvent.setParams({
                "url": "/" + component.get("v.recordId")
            });
            urlEvent.fire();
     }else {
             	var evt = $A.get("e.force:navigateToComponent");
		evt.setParams({
			componentDef : "c:activityTracker",
			componentAttributes: {
				//	recordId : component.get("v.recordId")
			}
		});
		
		evt.fire();

     }
		
		
    },
    
     handleClickSave: function(component, event, helper) {
        if (helper.validate(component)) {
            helper.createActivity(component);
        }
    },
    
    handleTaskStatusChange: function(component, event, helper) {
        var status = component.get("v.newTask.Status");
        if (status === "Open") {
            helper.reInitializeMaterialItems(component);;
        }
    },
    

})