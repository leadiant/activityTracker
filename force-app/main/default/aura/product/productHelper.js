({
    showError: function(component) {
        component.find("select").set('v.validity', { valid: false, valueMissing: true });
        component.find("select").showHelpMessageIfInvalid();
    },
    
    hideError : function(component){
        component.find("select").set('v.validity', { valid: true });
         component.find("select").showHelpMessageIfInvalid();
    },
    
})