({
    getValues: function(component, event, helper) {
        var params = event.getParam("arguments");
        var action = component.get("c.getTaskPicklistValuesApex");
      
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                params.callback(null,response.getReturnValue());
            } else {
                params.callback(response.getError());
            }
        });

        $A.enqueueAction(action);
    }
})