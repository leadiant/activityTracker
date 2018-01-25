public with sharing class  taskDataServiceApexController {
    
    @AuraEnabled 
    public static pickListValues getTaskPicklistValuesApex(){
        pickListValues pickVals = new pickListValues();
        
        Schema.DescribeFieldResult actStatus = Task.Status.getDescribe();
        for(Schema.PicklistEntry loop_var : actStatus.getPicklistValues()){
            pickVals.activityStatus.add(loop_var.getLabel());
        }
        
        Schema.DescribeFieldResult actSubject = Task.Subject.getDescribe();
        for(Schema.PicklistEntry loop_var : actSubject.getPicklistValues()){
            pickVals.activitySubject.add(loop_var.getLabel());
        }
        
        Schema.DescribeFieldResult actCallTp = Task.Call_Type__c.getDescribe();
        for(Schema.PicklistEntry loop_var : actCallTp.getPicklistValues()){
            pickVals.activityCallType.add(loop_var.getLabel());
        }
        
        Schema.DescribeFieldResult actONCTp = Task.ONC_Type_Call__c.getDescribe();
        for(Schema.PicklistEntry loop_var : actONCTp.getPicklistValues()){
            pickVals.activityONCType.add(loop_var.getLabel());
        }
        
        Schema.DescribeFieldResult actONCSciTp = Task.ONC_Scientific_Topic__c.getDescribe();
        for(Schema.PicklistEntry loop_var : actONCSciTp.getPicklistValues()){
            pickVals.activityONCScienceType.add(loop_var.getLabel());
        }
        
        Schema.DescribeFieldResult actProdType = Task.Active_Product__c.getDescribe();
        for(Schema.PicklistEntry loop_var : actProdType.getPicklistValues()){
            pickVals.activityONCProduct.add(loop_var.getLabel());
        }

        return pickVals;
        
    }
    public class pickListValues{
        @AuraEnabled
        public List<String> activityStatus {get;set;}
        @AuraEnabled
        public List<String> activitySubject {get;set;}
        @AuraEnabled
        public List<String> activityCallType {get;set;}
        @AuraEnabled
        public List<String> activityONCType {get;set;}
        @AuraEnabled
        public List<String> activityONCScienceType {get;set;}
        @AuraEnabled
        public List<String> activityONCProduct {get;set;}
        @AuraEnabled
        public List<String> activitySourceType {get;set;}

        public pickListValues(){
            activityStatus = new List<String>();
            activitySubject = new List<String>();
            activityCallType = new List<String>();
            activityONCType = new List<String>();
            activityONCScienceType = new List<String>();
            activityONCProduct = new List<String>();
            activitySourceType = new List<String>();
        }           
    }
    
}