
var {Pool, Client}=require("pg");
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
      const pool = new Pool({
        user:user,
        host:host,
        database:databaseName,
        password:password,
        port:5432
      })
      const sqlquery = 'INSERT INTO logs("date" , "event") VALUES($1, $2) RETURNING *'
      const values = [formatDate(new Date()), eventData]
      console.log("adding", values);

     pool.query(sqlquery, values,(err,res)=>{
        console.log(err,res);
        console.log("connection made");
        pool.end();
    })
      
    }

    //query function to make queries take less room
    async function query(sqlquery,values){
      
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
      var arrayR=[]
      
      
      return pool.query(query).then(res=>{return [true,res.rows]}).catch(e => {return [false,"failed"] })
      //const RR=pool.query(query).then(res=>(console.log(res))).catch(e => console.error(e.stack))
      
    }



    //gets all active users from database, might be changed into get user based on ID
    //used by SQL button
    //query with currentfunds works as long as it if WHERE currentfunds<x, so htey are written togerther
    module.exports.getUserdata = async function(req,res,next){
      var sqlquery;
      sqlquery='SELECT * FROM public.users ORDER BY "name" DESC;'
      
      const queryResult= query(sqlquery,[])
      const rows=queryResult.then(result=>{
        if(!result[0]){
          
          return {msg:"error ocurred"} 
        }
        console.log(result)
        return result[1]
      })
      console.log(rows)
      res.send(rows);
    }

    //checks if user exists based on given password and ID
    async function checkLogin(userID, psword){
      var sqlquery='SELECT * FROM login WHERE ("id", "psword")  VALUES($1,$2)';
      var values=[userID,psword]
      const queryResult= await query(sqlquery,values)
      return queryResult[0]
    }

    async function addUserToLogin(userId,pasword,email){
      const sqlquery='INSERT INTO login("id" , "psword", "email") VALUES($1, $2, $3) RETURNING *'
      const values=[userId,pasword,email]
      const queryResult= await query(sqlquery,values)
      
      return queryResult[0]

    }

    async function deleteUserFromLogin(userID){

      var sqlquery="DELETE FROM public.login WHERE id = $1";
      var values= [userID];
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
      //email=req.body.data.email

      console.log("id: "+id+" name" +name+"funds "+funds+" password "+psword);
      
      const sqlquery = 'INSERT INTO users("id" , "name", "currentfunds") VALUES($1, $2, $3) RETURNING *'
      if(!addUserToLogin(id,psword,"")){
        res.send({msg:"failed to make a user"})
        return
      }
      const values = [id, name, funds]
      const queryResult= await query(sqlquery,values)
      if(!queryResult[0]){
        await deleteUserFromLogin(id)
        res.send({msg:"error ocurred"})
        
      }
    
    }
    
    //removes the user based on key, or log informtaion
    //DELETE FROM films USING producers
  //WHERE producer_id = producers.id AND producers.name = 'foo';
    module.exports.removeUserFromDataBase = async function(req,res,next){

      const userExists=await checkLogin(req.body.userID,req.body.pasword)
      if(!userExists){
        res.send({msg:"user Does not exist"})
        return
      }else{
        if(await deleteUserFromLogin(req.body.userID)){
          res.send({msg:"deleting user failed/user does not exist"})
          return
        }
      }

      var sqlquery="DELETE FROM public.users WHERE id = $1";
      var values= [req.body.data.id];
      console.log(req.body)
      const queryResult= await query(sqlquery,values)
      if(!queryResult[0]){
        res.send({msg:"error ocurred"})
        return 
      }

      res.send({msg:"user destroyed"});
      pool.end()
    }

    //used to update user data
    //exampleUPDATE weather SET temp_lo = temp_lo+1, temp_hi = temp_lo+15, prcp = DEFAULT
  //WHERE city = 'San Francisco' AND date = '2003-07-03';
    module.exports.updateUserInDatabase = async function(req,res,next){
      var id=req.body.userData.id;
      var name=req.body.userData.name;
      var funds=req.body.userData.funds;
      var sqlquery="UPDATE public.users SET name = $1, currentfunds = $2 WHERE id = $3";
      var values=[name, funds, id];
      const queryResult= await query(sqlquery,values)
      if(!queryResult[0]){
        res.send({msg:"error ocurred"})
        return 
      }
      res.send(queryResult[1]);
      
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
      }
      res.send(queryResult[1]);
      
    }

    module.exports.updateProductData = async function(req,res,next){}



/* end product back ned ends here */



    //test function for getting data in a format
    module.exports.getData=  async function(req,res,next){
        console.log("test");
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


    module.exports.initialize = function initializeDB(){
        createDatabase();
        addTable();
        return "databases done";
    }

 

    exports.Test = async function(req,res,next){
      //res.send(req.body);
      console.log(req.body);
    }

    module.exports.testC=function connect(){
      return getUserId();
    }


   
        
    

  
//}
    




  