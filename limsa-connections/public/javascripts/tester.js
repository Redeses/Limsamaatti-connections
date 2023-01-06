
var DBM=require('../public/javascripts/DatabaseManage');

//test data matrixes
const userDBTestMatrix=[[]]
const productDBTestMatrix=[[]]
const loginDBTestMatrix=[[]]
const logsDBTestMatrix=[[]]

//general tests for User Table
async function test_cases_USER(){

}

//general test for the product Table: adding deleting, modifying 
async function test_cases_PRODUCT(){
    
}

//general tests for the loging Table: adding and deleting from the table
async function test_cases_LOGIN(){
    
}

//general test for the logger: adding events:::: LAter deleting events
async function test_cases_LOGGER(){
    
}

//original name:DELETION_OF_USER_AND_PURCHASE_WITH_THEIR_CREDENTIALS
async function test_cases_DOUAPWTC(){

}

//original name: TRYING_TO_PURCHASE_MORE_PRODUCTS_THAN_AVAILABLE
async function test_cases_TTPMPTA(){

}

//TODO more cases

/* Tested functions, here as a reminder

     function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
      }
      
      function formatDate(date) {
        return [
          padTo2Digits(date.getDate()),
          padTo2Digits(date.getMonth() + 1),
          date.getFullYear(),
        ].join('/');
      }
      
  
       async function addToLog(eventData){
        const sqlquery = 'INSERT INTO logs("date" , "event") VALUES($1, $2) RETURNING *'
        const values = [formatDate(new Date()), eventData]
        Logger.getInstance().logEvent(eventData);
      }
  
      async function query(sqlquery,values){
        var loggerText="In query: "+sqlquery+"  with values"+JSON.stringify(values)+" Result: "
        const query={
          text:sqlquery,
          values:values
        }
      }
  
      async function checkIfAdmin(){
        return true;
      }
  
  
      module.exports.getUserdata = async function(req,res,next){
        var sqlquery;
        sqlquery='SELECT * FROM public.users ORDER BY "id" DESC;'
      }

      async function checkLogin(userID, psword){
        var sqlquery='SELECT * FROM login WHERE "userID" = $1 AND "psword" = $2';
        var values=[userID,psword]
      }
  
      async function addUserToLogin(userId,pasword,email){
        const sqlquery='INSERT INTO login("userID" , "psword", "email") VALUES($1, $2, $3) RETURNING *'
        const values=[userId,pasword,email]
      }
  
      async function deleteUserFromLogin(userID){
        var sqlquery='DELETE FROM public.login WHERE "userID" = $1';
        var values= [userID];
      }
  
      module.exports.getAUser = async function(req,res,next){
        var sqlquery="SELECT * FROM users WHERE id = $1";
        var values=[req.body.userID]
        const userExists=await checkLogin(req.body.userID,req.body.pasword)
      }
  
      module.exports.addUserToDatabase = async function(req,res,next){
        
        id=req.body.data.id;
        name=req.body.data.name;
        funds=req.body.data.funds;
        psword=req.body.data.pasword
        //email?
        const sqlquery = 'INSERT INTO users("id" , "name", "currentfunds") VALUES($1, $2, $3) RETURNING *'
        const result=await addUserToLogin(id,psword,"")
        const values = [id, name, funds]
        }
      
      module.exports.removeUserFromDataBase = async function(req,res,next){
        const userExists=await checkLogin(req.body.data.id,req.body.data.pasword)
        
          const deleted=await deleteUserFromLogin(req.body.data.id)
          
         var sqlquery="DELETE FROM public.users WHERE id = $1";
        var values= [req.body.data.id];
    }
  
      module.exports.updateUserInDatabase = async function(req,res,next){
        
        var id=req.body.userData.id;
        var name=req.body.userData.name;
        var funds=req.body.userData.funds;
        var sqlquery="UPDATE public.users SET name = $1, currentfunds = $2 WHERE id = $3";
        var values=[name, funds, id];
        
        
      }
      
      module.exports.getProductData = async function(req,res,next){
        var sqlquery="SELECT * FROM public.products";
      }
      
      module.exports.addProductData = async function(req,res,next){
        var productName=req.body.data.name;
        var productprice=req.body.data.price;
        var productImgName=req.body.data.imgName;
        
      const sqlquery = 'INSERT INTO products("name" , "price", "picturename") VALUES($1, $2, $3) RETURNING *'
      var values = [productName, productprice,productImgName];
      
    }
      

      module.exports.removeProductData = async function(req,res,next){
        var sqlquery="DELETE * FROM public.users WHERE name = " + req.body.data.name;
        
        
      }
  
      module.exports.updateProductDataOnSale = async function(req,res,next){
        var sqlquery="UPDATE currentfunds SET currentfunds= currentfunds - $1 FROM users WHERE id = $1 AND currentfunds >= $2 RETURNING *";
        var values=[req.body.data.useId, req.body.data.totalCost]
        var sqlquery2="UPDATE public.products SET instore = intstore - $1 WHERE name = $2";
        var values2=[req.body.data.itemNRO, req.body.data.productName];
    
        
      }
      
      
      
      
      module.exports.updateProductData = async function(req,res,next){}
  

  
    }
  
  
  
      
  
  
  
  
     */