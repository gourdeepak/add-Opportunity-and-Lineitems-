public class SearchProducts {
    @AuraEnabled(cacheable = true)
    public static list<Product2> getProducts(string searchKey){
        string keyString = '%'+ searchKey +'%';
        list<product2> productlist = [select id, name from product2 where name like : keyString];
        return productlist;
    }
    @AuraEnabled(cacheable = false)
    public static List<OpportunityLineItem> createOLI(String OLIList){
        try{
            
            list<pricebookentry> pricebooklist = [select id, product2id from pricebookentry];
            map<id,id> productTpPriceBookmap = new map<id,id>();
            for(pricebookentry pbe : pricebooklist){
                if(!productTpPriceBookmap.containsKey(pbe.product2id)){
                    productTpPriceBookmap.put(pbe.product2id, pbe.id);
                }
            }
        List<OpportunityLineItem> oppProductList=(List<OpportunityLineItem>)JSON.deserialize(OLIList, List<OpportunityLineItem>.Class);
   		list<OpportunityLineItem> newolilist = new list<OpportunityLineItem>();
            if(!oppProductList.isEmpty()){
            for(OpportunityLineItem oli : oppProductList){
                OpportunityLineItem newoli = new OpportunityLineItem();
                newoli.OpportunityId = oli.OpportunityId;
                newoli.Product2Id  = oli.Product2Id;
                newoli.PricebookEntryId = productTpPriceBookmap.get(oli.Product2Id);
                newoli.Quantity = oli.Quantity;
                newoli.UnitPrice = oli.UnitPrice;
                newolilist.add(newoli);
            }
            
        }
            system.debug('newolilist------'+newolilist);
            insert newolilist;
            return newolilist;
        }catch(DmlException e){
            system.debug('message------'+e.getMessage());
            return null;
        }
       
    
    }

}