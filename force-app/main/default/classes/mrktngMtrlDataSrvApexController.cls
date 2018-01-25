public with sharing class  mrktngMtrlDataSrvApexController {
    
    @AuraEnabled
    public static List<ONC_Marketing_Material__c> getActiveMarketingMaterialsApex() {
        return [SELECT Id, Name, Active_Product__c, Item_Cost__c, 
                       Item_Description__c, Active__c FROM ONC_Marketing_Material__c WHERE Active__c =true];        
    }

}