var express = require("express");
var router = express.Router();
var DBM=require('../public/javascripts/DatabaseManage');


//express routes


router.get("/", function(req, res, next) {
    res.send(DBM.test());
});



//the final used routes: Add/get/remove products. Add/get/remove user
router.get("/getProducts", DBM.getProducts)



router.post("/testC", DBM.addUserToDatabase);
router.post("/callD", DBM.getUserdata);



router.get("/data", function(req,res,next){
  res.send(JSON.stringify(DBM.getData()));
})

router.post("/saveData", function(req,res,next){
  res.send(req.body);
});

//has get/set/remove products and get/set/remove users
//
/*final product routes */
router.post("/addUser", DBM.addUserToDatabase)
router.get("/getUsers", DBM.getUserdata)
router.post("/removeUser", DBM.removeUserFromDataBase)
router.post("/updateUser", DBM.updateUserInDatabase)
router.post("/getAUser", DBM.getAUser)

router.post("/updateProductAndUser", DBM.updateProductDataOnSale)
//will be admin routes only
router.get("/getProductsFromDB",DBM.getProductData)
router.post("/addProduct", DBM.addProductData)
router.post("/removeProduct", DBM.removeProductData)
router.post("/updateProduct", DBM.updateProductData)

//admin routes
router.get("/clearUserTable", DBM.clearUserTable)
router.get("/deleteAUser", DBM.clearUserTable)
router.get("/checkLog", DBM.clearUserTable)


module.exports = router;

