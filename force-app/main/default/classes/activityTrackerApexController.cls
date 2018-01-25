public with sharing class  activityTrackerApexController {
    
    //Default Status
    public static final String DEFAULT_STATUS = 'Completed';
    //Default Subject
    public static final String DEFAULT_SUBJECT = 'Call';
    //Default Call Type
    public static final String DEFAULT_CALLTYPE = 'In-Person Visit';
    //Default Type Of Call
    public static final String DEFAULT_TYPEOFCALL = 'Branded';

     public class SelectOption {

        public SelectOption(string strLabel, string strValue,Boolean bSelected,Boolean bDisabled) {
            label = strLabel;
            value = strValue;
            selected = bSelected;
            disabled = bDisabled;
            
        }

        @AuraEnabled
        public string label { get; set; }

        @AuraEnabled
        public string value { get; set; }
        
        @AuraEnabled
        public Boolean  selected { get; set; }
        
        @AuraEnabled
        public Boolean  disabled { get; set; }
    }
    
    @AuraEnabled
    public static String insertActivity(sObject task,List<sObject> materialItems){
        
         strike_responseData responseData = new strike_responseData();
        
         try {
                 insert task;
        		 insert materialItems; 

             responseData.results = new Map<String, Object>{
                    'task' => task
                };
            }
            
            catch (Exception e) {
            	responseData.addError(e.getMessage());
        }
        
        return responseData.getJsonString();
        
    }
    
    
    @AuraEnabled
    public static String getContactDetails(String jsonString) {
         
      strike_responseData responseData = new strike_responseData();
        
        try {
                List<SelectOption> productOptions = new List<SelectOption>();
                Map<String, Object> jsonMap = (Map<String, Object>)JSON.deserializeUntyped(jsonString);
                
                Id contactId = (String)jsonMap.get('contactId');
                
                Contact con = Database.query('SELECT Id,accountId,Active_product__c FROM Contact WHERE Id =:contactId limit 1');
                
               if (string.isNotEmpty(con.Active_product__c)) {
                        for (string product : con.Active_product__c.split(';') ) {
                            productOptions.add(new SelectOption(product,product,false,false));
                    }
                } 
                else {
                    responseData.addError('Product is not assigned to the selected contact.');
                }
                
                responseData.results = new Map<String, Object>{
                    'data' => productOptions,
                    'accountId' => con.accountId
                    
                };
            }
            
            catch (Exception e) {
            responseData.addError(e.getMessage());
        }
        
        return responseData.getJsonString();
    }
    
    
    @AuraEnabled
    public static String getPicklistValues() {
    
      strike_responseData responseData = new strike_responseData();
      responseData.results = activityTrackerApexController.getData();
      return responseData.getJsonString();
    }
    
    
    private static Map<String, Object> getData() {
     
      List<Map<String, Object>> data = new List<Map<String, Object>>();
      List<Map<String, Object>> marketingMaterials = new List<Map<String, Object>>();
      
      Map <String, List <ONC_Marketing_Material__c>> marketingMaterialsMap = new Map <String, List <ONC_Marketing_Material__c>>();

      List<SelectOption> statusOptions = new List<SelectOption>();
      Schema.DescribeFieldResult actStatus = Task.Status.getDescribe();
        for(Schema.PicklistEntry entry : actStatus.getPicklistValues()){
            if (entry.getValue().equals(DEFAULT_STATUS))
                statusOptions.add(new SelectOption(entry.getLabel(), entry.getValue(),true,false));
            else
                statusOptions.add(new SelectOption(entry.getLabel(), entry.getValue(),false,false));
        }
        
        data.add(new Map<String, Object>{
                    'field'  => 'Status',
                    'values' => statusOptions
                });
        
       
       List<SelectOption> subjectOptions = new List<SelectOption>();
        Schema.DescribeFieldResult actSubject = Task.Subject.getDescribe();
        for(Schema.PicklistEntry entry : actSubject.getPicklistValues()){
            if (entry.getValue().equals(DEFAULT_SUBJECT))
                subjectOptions.add(new SelectOption(entry.getLabel(), entry.getValue(),true,false));
            else
                subjectOptions.add(new SelectOption(entry.getLabel(), entry.getValue(),false,false));
           
         
        }
        
         data.add(new Map<String, Object>{
                    'field'  => 'Subject',
                    'values' => subjectOptions
                });
        
        List<SelectOption> callTypeOptions = new List<SelectOption>();
        Schema.DescribeFieldResult callType = Task.Call_Type__c.getDescribe();
        for(Schema.PicklistEntry entry : callType.getPicklistValues()){
             if (entry.getValue().equals(DEFAULT_CALLTYPE))
                callTypeOptions.add(new SelectOption(entry.getLabel(), entry.getValue(),true,false));
            else
                callTypeOptions.add(new SelectOption(entry.getLabel(), entry.getValue(),false,false));
        }
        
        data.add(new Map<String, Object>{
                    'field'  => 'CallType',
                    'values' => callTypeOptions
                });
                
        List<SelectOption> typeOfCallOptions = new List<SelectOption>();
        Schema.DescribeFieldResult actONCTp = Task.ONC_Type_Call__c.getDescribe();
        for(Schema.PicklistEntry entry : actONCTp.getPicklistValues()){
           if (entry.getValue().equals(DEFAULT_TYPEOFCALL))
                typeOfCallOptions.add(new SelectOption(entry.getLabel(), entry.getValue(),true,false));
            else
                typeOfCallOptions.add(new SelectOption(entry.getLabel(), entry.getValue(),false,false));
        }
        
        data.add(new Map<String, Object>{
                    'field'  => 'TypeOfCall',
                    'values' => typeOfCallOptions
                });
        
        List<SelectOption> scientificTopicOptions = new List<SelectOption>();
        Schema.DescribeFieldResult actONCSciTp = Task.ONC_Scientific_Topic__c.getDescribe();
        for(Schema.PicklistEntry entry : actONCSciTp.getPicklistValues()){
            scientificTopicOptions.add(new SelectOption(entry.getLabel(), entry.getValue(),true,false));
        }
        
        data.add(new Map<String, Object>{
                    'field'  => 'ScientificTopic',
                    'values' => scientificTopicOptions
                });
        
        List<SelectOption> sourceTypeOptions = new List<SelectOption>();
        Schema.DescribeFieldResult sourceType  = Material_Items__c.Source_Type__c.getDescribe();
        for(Schema.PicklistEntry entry : sourceType.getPicklistValues()){
            sourceTypeOptions.add(new SelectOption(entry.getLabel(), entry.getValue(),true,false));
        }
        
        data.add(new Map<String, Object>{
                    'field'  => 'SourceType',
                    'values' => sourceTypeOptions
                });
                
        for (ONC_Marketing_Material__c marketingMaterial:  [SELECT Id, Name, Active_Product__c, Item_Cost__c, 
                       Item_Description__c, Active__c FROM ONC_Marketing_Material__c WHERE Active__c =true ORDER BY Active_Product__c])
           {
               if (marketingMaterialsMap.containsKey(marketingMaterial.Active_Product__c) )
                    marketingMaterialsMap.get(marketingMaterial.Active_Product__c).add(marketingMaterial);
                else
                {
                    marketingMaterialsMap.put(marketingMaterial.Active_Product__c, new List <ONC_Marketing_Material__c>{marketingMaterial});
                }
           }
                                 
        for ( string product : marketingMaterialsMap.keySet() )
            {
                marketingMaterials.add (new Map<String, Object>{
                            'product'  => product,
                            'values' => marketingMaterialsMap.get(product)
                        });
            }
        return new Map<String, Object>{
                   'data' => data,
                   'marketingMaterials' => marketingMaterials
        };
        
    }
 
}