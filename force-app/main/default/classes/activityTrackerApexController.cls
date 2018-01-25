public with sharing class  activityTrackerApexController {
    
    @AuraEnabled 
    public static String saveActivity(Task task,List<Material_Items__c> materialItems){
    
     try{
        
        List<Contact> contacts = [Select AccountId From Contact Where Id = :task.WhoId limit 1];
        task.WhatId = contacts[0].AccountId;
        task.Priority = 'Normal';
         
         for(Material_Items__c materialItem : materialItems){
             materialItem.Contact__c = task.WhoId;
         }
        insert task;
        
        insert materialItems; 
        return 'SUCCESS';
    
     }catch(Exception e){            
         system.debug('ERROR' + e.getMessage());
         return 'ERROR';
     }
    
    }
    
    
}