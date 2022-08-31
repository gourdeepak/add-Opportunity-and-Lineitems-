import { LightningElement, track, api } from 'lwc';
import getProducts from '@salesforce/apex/SearchProducts.getProducts';
import createOLI from '@salesforce/apex/SearchProducts.createOLI';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class CreateOppAndAddOli extends LightningElement {
    @api recordId;
    @track opportunityId;
   @track showsearch= false;
    @track label = "save";
    @track type = "submit";
    handleclick(event){
        if(event.target.label == "save"){
            this.label = "update";
            console.log('this.type-----'+this.type);
            
        }
        else if(event.target.label == "update"){
            this.showsearch = true;
            this.type = "save";
        }
    }

    handleSuccess(event){
        console.log('event.detail.id------'+event.detail.id);
        this.opportunityId = event.detail.id;
        console.log('this.opportunityId------'+this.opportunityId);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Opportunity Created!',
                variant: 'success',
            }),
        );
    }
    @track proName;
    @track productList =[];
    @track error;
    @track showtable = false;
    handleChange(event){
        this.proName = event.target.value;
        console.log('this.proName------'+this.proName);
        getProducts({searchKey : this.proName})
        .then(result =>{
            this.productList = result;
            console.log('productList-------'+productList);
        }).catch(error=>{
            this.error = error;
        })
        this.showtable = true;
    }
   
    @track selectedProducts = [];
    handlecheckboxclick(event){
        console.log('event.target.label--------'+event.target.label);
        console.log('event.target.value--------'+event.target.value);
        var selectpro = {id : event.target.value,
                         Name : event.target.label,
                            };
        console.log('selectpro---'+JSON.stringify(selectpro));
        this.selectedProducts.push(selectpro);
        // var selectpro = [{
        //     Id : event.target.value,
        //     Name : event.target.label,
        // }];
        // console.log('event.selectpro--------'+JSON.stringify(selectpro));
        // this.selectedProducts.push(JSON.stringify(selectpro));
        console.log('this.selectedProducts--------'+JSON.stringify(this.selectedProducts));
    }

    @track oliList =[
        {
            OpportunityId : '',
            Product2Id : '',
            Quantity : '', 
            UnitPrice : '',
         //   PricebookEntryId : '',
        }
    ];
    @track showSelectedProducts = false;
    handleNextclick(){
        this.showSelectedProducts=true;
        console.log('this.showSelectedProducts-----'+this.showSelectedProducts);
        console.log('selected products length----'+this.selectedProducts.length);
        for(var i=1; i<this.selectedProducts.length; i++){
            console.log('inside loop');
            this.oliList.push(
                {
                    OpportunityId : '',
                    Product2Id : '',
                    Quantity : '', 
                    UnitPrice : '',
                   // PricebookEntryId : '',
                }
            );
           
        }
        console.log(' this.oliList----'+ this.oliList);
    }

    

   // @track draftIndex;
    handleInputChange(event){
        // let rowobj= [];
        // rowobj.id = event.target.dataset.id;
        // if (this.selectedProducts.findIndex(obj => obj.id === rowobj.id !== -1)) {

        //      this.draftIndex = this.selectedProducts.findIndex(obj => obj.id === rowobj.id);
            
        //      console.log('Draf index-->' + this.draftIndex);
            
        //     }
        //     switch (selector){
        //         case 'ProQuantity' :
        //             this.selectedProducts[this.draftIndex].ProQuantity = event.currentTarget.value;
        //             break;
        //         case 'ProAmount':
        //             this.selectedProducts[this.draftIndex].ProAmount = event.currentTarget.value;
        //             break;

        //     } 
        //     console.log('Product    '+this.selectedProducts);

        if(event.target.name ==='ProQuantity'){
            console.log('event.target.value----'+event.target.value);
            console.log('event.target.id----'+event.target.id);
            console.log('event.target.accessKey---'+event.target.accessKey);
          this.oliList[event.target.accessKey].Quantity = event.target.value;
         
            console.log('this.opportunityId----'+this.opportunityId);
             this.oliList[event.target.accessKey].OpportunityId = this.opportunityId;
           // this.oliList[event.target.accessKey].PricebookEntryId = '01u5j000003MShbAAG';
            console.log('event.target.id----'+event.target.id);
            let productid = event.target.id;
            productid = productid.slice(0, 18);
            this.oliList[event.target.accessKey].Product2Id = productid;
        }
        else if(event.target.name ==='ProAmount'){
            this.oliList[event.target.accessKey].UnitPrice = event.target.value;
        }
        console.log('oliList--------'+JSON.stringify(this.oliList));
    }

    
    saveoli(){
        console.log('save clicked')
        createOLI({OLIList : JSON.stringify(this.oliList)})
        .then(result=>{

            console.log('result--------'+JSON.stringify(result));
            this.message = JSON.stringify(result);
            console.log('record created successfully');
            if(this.message != 'null'){
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Success',
                    message : 'Products Added Successfully',
                    variant : 'success',

                }),

                
            );
            }else{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message : 'Error while Adding Product',
                        variant : 'error',
                    }),
                );
            }

        })
        .catch(error =>{
            console.log('error------'+JSON.stringify(error));
            console.log('error occured');
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message : 'Error while Adding Product',
                    variant : 'error',
                }),
            );
        })
    }

    

}