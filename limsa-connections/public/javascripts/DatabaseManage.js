
var {Pool, Client}=require("pg");
//import Logger from "./Logger";
const { json } = require('body-parser');
const host="localhost";
const user="LimsaUser";
const password='TestOne';
const databaseName="postgres";
//const connectionPort="5433";
//nmaster pass :TItextyDat10


    //getLog provides log information for events to admin in the front
    //can be used to remove a user or just check the log
    module.exports.getLog=function getLog(){

    }



    //used to init database if it is required
    function initDatabas(){}

  /*End product backend starts here */ 

    //following are needed: AddToLog, getUserId, init database, add/get/remove from products, add/get/remove from users

     //is called whenever any event happens, even failed ones. Add's a log to either DB, or just
     //basic word file that is crambled by the admin key
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
      const queryresult= await query(sqlquery,values);
      //Logger.getInstance().logEvent(eventData);
      
    }

    //query function to make queries take less room
    //NOTE: the logger text is for the log keeping
    async function query(sqlquery,values){
      var loggerText="In query: "+sqlquery+"  with values"+JSON.stringify(values)+" Result: "
      
      const pool = new Pool({
        user:user,
        host:host,
        database:databaseName,
        password:password,
        port:5432
      })
      const query={
        text:sqlquery,
        values:values
      }
      
      
      return pool.query(query)
      .then(res=>{
        console.log(res)
        loggerText+="Success"
        if(res.rows.length===0){
          //addToLog(loggerText)
          return [true,"Success"]
        }else{
          //addToLog(loggerText+=" RTURNING: "+ JSON.stringify(res.rows))
          return [true,res.rows]
        }
        
      })
      .catch(e => {console.log(e);/*addToLog(loggerText+ " FAILED")*/;return [false,"failed"] })
      //const RR=pool.query(query).then(res=>(console.log(res))).catch(e => console.error(e.stack))
      
    }

    async function checkIfAdmin(ID,pasword){
      return true;
      var sqlquery='SELECT * from login WHERE "userID" = $1 AND "psword" = $2 AND "isadmin"=true'
      var values=[ID,pasword];
      const queryResult= await query(sqlquery,values);
      return queryResult[0]
    }



    //gets all active users from database, might be changed into get user based on ID
    //used by SQL button
    //query with currentfunds works as long as it if WHERE currentfunds<x, so htey are written togerther
    module.exports.getUserdata = async function(req,res,next){
      var sqlquery;
      sqlquery='SELECT * FROM public.users ORDER BY "id" DESC;'
      
      const queryResult= query(sqlquery,[])
      const rows= await queryResult.then(result=>{
        if(!result[0]){
          
          return {msg:"error ocurred"} 
        }
        return result[1]
      })
      res.send(rows);
    }

    //checks if user exists based on given password and ID
    //note!! login check could also be done with one command as per SQL
    async function checkLogin(userID, psword){
      var sqlquery='SELECT * FROM login WHERE "userID" = $1 AND "psword" = $2';
      var values=[userID,psword]
      
      console.log("checking login " + values)
      const queryResult= await query(sqlquery,values)
      return queryResult[0]
    }

    async function checkIfEmailTaken(email){
      var sqlquery='SELECT * FROM login WHERE "email" = $1';
      var values=[email]
      const queryResult= await query(sqlquery,values)
      return queryResult[0]
    }
    

    //TODO check! again?
    async function addUserToLogin(userId,pasword,email){
      qResult=await checkIfEmailTaken(email);

      if(!qResult){
        return {msg:"Email has been taken"}
      }else{
        
        const sqlquery='INSERT INTO login("userID" , "psword", "email") VALUES($1, $2, $3) RETURNING *'
        const values=[userId,pasword,email]
        console.log("adding to login: " + values)
        const queryResult= await query(sqlquery,values)
        return queryResult[0]
      }

    }

    async function deleteUserFromLogin(userID){
      var sqlquery='DELETE FROM public.login WHERE "userID" = $1';
      var values= [userID];
      console.log("deleting from login" + userID)
      const queryResult= await query(sqlquery,values)
      return queryResult[0]
    }

    //gets a single user with a specific id and a password
    //User is checked against public.user table, while the password is checked from public.login
    //if one or either one fails, the query fails. Also will get the user data from the
    module.exports.getAUser = async function(req,res,next){
      var sqlquery="SELECT * FROM users WHERE id = $1";
      var values=[req.body.userID]
      const userExists=await checkLogin(req.body.userID,req.body.pasword)
      if(!userExists){
        res.send({msg:"password or user incorrect"})
        return
      }
      
      const queryResult= await query(sqlquery,values)
      if(!queryResult[0]){
        res.send({msg:"error ocurred"})
        return 
      }
      res.send(queryResult[1]);
    }

    //adds user to database with the information from the front end, and use of a magnetic key here
    //on get user ID, that is used as a main key
    //!!!TODO toimii alemman SQLquery tapaisesti, toimii yllä että alla. Seuraavaksi frontissa tee
    //pop up windowsita yhteinen, eli se vaan näyttää/otta eri dataa, sekä tee final
    //lisäys, update ja haku(poisto) käyttäjille connectorissa ja databasessa
    module.exports.addUserToDatabase = async function(req,res,next){
      var name,id,funds,psword,email,error=false;
      console.log("adding user to db");
      id=req.body.data.id;
      name=req.body.data.name;
      funds=req.body.data.funds;
      psword=req.body.data.pasword
      email=req.body.data.email

      console.log("id: "+id+" name" +name+"funds "+funds+" password "+psword);
      
      const sqlquery = 'INSERT INTO users("id" , "name", "currentfunds") VALUES($1, $2, $3) RETURNING *'
      const result=await addUserToLogin(id,psword,email)
      if(!result){
        res.send({msg:"failed to make a user"})
        console.log("test of fail")
      }else{
        console.log("moving on")
        const values = [id, name, funds]
        const queryResult= await query(sqlquery,values)
        if(!queryResult[0]){
          await deleteUserFromLogin(id)
          res.send({msg:"error ocurred"})
        }
      }
    
    }
    
    //removes the user based on key, or log informtaion
    //DELETE FROM films USING producers
  //WHERE producer_id = producers.id AND producers.name = 'foo';
    module.exports.removeUserFromDataBase = async function(req,res,next){
      //console.log(req.body.data)
      const userExists=await checkLogin(req.body.data.id,req.body.data.pasword)
      if(!userExists){
        res.send({msg:"user Does not exist"})
        
      }else{
        const deleted=await deleteUserFromLogin(req.body.data.id)
        console.log("deletion from login was: "+deleted)
        if(!deleted){
          res.send({msg:"deleting user failed/user does not exist"})
        }else{
          var sqlquery="DELETE FROM public.users WHERE id = $1";
          var values= [req.body.data.id];
          const queryResult= await query(sqlquery,values)
          //console.log(queryResult)
          if(!queryResult[0]){
            res.send({msg:"error ocurred"})
             
          }else{
            
            res.send({msg:"user destroyed"});
          }

      
        }
      }

    }

    //used to update user data
    //exampleUPDATE weather SET temp_lo = temp_lo+1, temp_hi = temp_lo+15, prcp = DEFAULT
  //WHERE city = 'San Francisco' AND date = '2003-07-03';
    module.exports.updateUserInDatabase = async function(req,res,next){
      
      var id=req.body.userData.id;
      var name=req.body.userData.name;
      var funds=req.body.userData.funds;
      console.log("Updating user:"+id)
      var sqlquery="UPDATE public.users SET name = $1, currentfunds = $2 WHERE id = $3";
      var values=[name, funds, id];
      const queryResult= await query(sqlquery,values)
      if(!queryResult[0]){
        res.send({msg:"error ocurred"})
        return 
      }
      res.send({msg:false});
      
    }
    
    //gets all products in the database and sends them to the front
    module.exports.getProductData = async function(req,res,next){
      var sqlquery="SELECT * FROM public.products";
      
      const queryResult= await query(sqlquery,[])
      if(!queryResult[0]){
        res.send({msg:"error ocurred"})
        return 
      }
      
      res.send(queryResult[1]);
      
    }
    
    //adds product to the database based on the specifications of the admin. Has: name, price and image_name atelast
    module.exports.addProductData = async function(req,res,next){
      var productName=req.body.data.name;
      var productprice=req.body.data.price;
      var productImgName=req.body.data.imgName;
      
    const sqlquery = 'INSERT INTO products("name" , "price", "picturename") VALUES($1, $2, $3) RETURNING *'
    var values = [productName, productprice,productImgName];
    const queryResult= await query(sqlquery,values)
      if(!queryResult[0]){
        res.send({msg:"error ocurred"})
        return 
    }
  }
    
    //removes a product base on name. Will most likeyly be done by name as unique keys are not neccesary for products
    module.exports.removeProductData = async function(req,res,next){
      var sqlquery="DELETE * FROM public.users WHERE name = " + req.body.data.name;
      const queryResult= await query(sqlquery,[])
      if(!queryResult[0]){
        res.send({msg:"error ocurred"})
        return 
      }else{
        res.send(queryResult[1]);
      }
      
      
    }

    //updates the product stock(eventually) and removes money from user
    //GETS: userId, productName, totalCost, itemNro
    //also has to check if user has the money to make the purchase
    //TODO make update stock of the product, maybe add password cheking functionality later
    module.exports.updateProductDataOnSale = async function(req,res,next){
      console.log(req.body.data)
      //checking if the user actuallly has the funds to pay
      var sqlquery="UPDATE currentfunds SET currentfunds= currentfunds - $1 FROM users WHERE id = $1 AND currentfunds >= $2 RETURNING *";
      var values=[req.body.data.useId, req.body.data.totalCost]
      const queryResult= await query(sqlquery,values)
      if(queryResult[0]){
        //check if there are enough of the product in store and update the amount
        var sqlquery2="UPDATE public.products SET instore = intstore - $1 WHERE name = $2";
        var values2=[req.body.data.itemNRO, req.body.data.productName];
        const queryResult2= await query(sqlquery2,values2)
        if(queryResult2[0]){
          res.send({msg:"Product purchase succesfull"})
        }else{
          //needs to reverse user update
          var reverseQuery="UPDATE currentfunds SET currentfunds= currentfunds + $1 FROM users WHERE id = $1 AND currentfunds >= $2 RETURNING *";
          var values3=[req.body.data.useId, req.body.data.totalCost]
          const reverseQueryResult=await query(reverseQuery,values3)
          if(reverseQueryResult[0]){
            res.send({msg:"Buying a product failed, pelase try again"})
          }else{
            res.send({msg:"Second level error ocurred, contact administration"})
          }
        }
      }else{
        if(!queryResult[0]){
          res.send({msg:"error ocurred, failed to update user data"})
          return 
        }
      }  
    }
    
    
    
    
    module.exports.updateProductData = async function(req,res,next){
      //
      console.log(req.body.data)
      if(checkIfAdmin(req.body.date.id, req.body)){
        var sqlquery="UPDATE public.products SET(instore,price, pictureName)  VALUES($1,$2,$3) WHERE name = $4";
        var values=[req.body.data.itemNRO, req.body.date.productPrice,req.body.data.productPicName,req.body.data.productName];
        const queryResult=await query(sqlquery,values)

      }else{
        res.send({msg:"permission denied"})
      }
    }



/* end product back ned ends here */



    //test function for getting data in a format
    //NOTE: DEPRICATED
    module.exports.getData=  async function(req,res,next){
        //console.log("test");
        //var testData=getAllData();
        /*var testData=[
            ["Mikko", 5],["norppa", 1],["valas", 999]
        ]*/
        //sqlquery="SELECT * FROM public.users WHERE name='Brian'";
        sqlquery="SELECT * FROM public.users";
        const pool = new Pool({
          user:user,
          host:host,
          database:databaseName,
          password:password,
          port:5432
      })
      
      //console.log(pool);
      const value= await pool.query(sqlquery)
      //console.log(typeof(value.rows[0]))
     
      res.send(value.rows);
      pool.end();
      
    }

    //DEPRICATED
    module.exports.getProducts=  async function(req,res,next){
      var sqlquery="SELECT * FROM public.products";
      
      const pool = new Pool({
          user:user,
          host:host,
          database:databaseName,
          password:password,
          port:5432
      })
      
      const value= await pool.query(sqlquery)
     
      res.send(value.rows);
      pool.end();
      
  }

    //TODO make this work
    module.exports.initialize = function initializeDB(){
        createDatabase();
        addTable();
        return "databases done";
    }

 

    // still in use
    exports.Test = async function(req,res,next){
      //res.send(req.body);
      console.log(req.body);
    }

    //method to clear tables from user side
    //later on more specific 
    module.exports.clearUserTable=async function(req,res,next){
      sqlquery="TRUNCATE users"
      query(sqlquery,[])
      sqlquery="TRUNCATE login"
      query(sqlquery,[])
      
    }

    //TODO make a clear tables that will clear those selected by Admin


   
        
    

  
//}
    




  