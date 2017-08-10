//Require the mysql package
var mysql = require("mysql");

//Require the inquirer package
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "2236Nivlem!!",
  database: "products_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  
  //Welcome customers to the website
  console.log("Welcome to Bamazon!");
  
  // run the merchandise function to show all the items for sale on bamazon
  merchandise();
});

function merchandise(){
  connection.query("SELECT * FROM products", function(err,res){
    console.log("Item ID " + " | " + " Product Name " + " | " + " Price ");
    console.log("-----------------------------------");
    for(var i = 0; i < res.length; i++){
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
    }
    console.log("-----------------------------------");
    chooseMerchandise();
  });

  
}

function chooseMerchandise() {
  //Query the database for all items being sold on bamazon
  connection.query("SELECT * FROM products", function(err,res){
    if(err) throw err;
    //Prompt the user to select which item they'd like to purchase
    inquirer.prompt([
    { 
      name: "id",
      type: "input",
      message: "Enter the ID of the item you would like to purchase.",
      validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
    },
    {
      name: "quantity",
      type: "input",
      message: "How many would you like to purchase?",
      validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
    }
      ]).then(function(ans){


        //Get the quantity of the selected item
        for(i=0; i<res.length; i++) {
            //console.log(res[i].item_id);
            if(res[i].item_id === parseInt(ans.id)){
              var remainingQuantity = res[i].stock_quantity;
              if(remainingQuantity < parseInt(ans.quantity)){
                console.log("Sorry Insufficient Quantity, we only have " + remainingQuantity + " in stock!");
                merchandise();
              }else{
                    var newQuantity = remainingQuantity - parseInt(ans.quantity);
                    //console.log(newQuantity);
                    connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: newQuantity
                      },
                      {
                        item_id: ans.id
                      }
                    ],
                    function(error) {
                      if (error) throw err;
                      connection.query("SELECT price FROM products WHERE ?",
                            {
                              item_id: ans.id
                            }, function(err,res){
                              if(err) throw err;
                              //console.log(res[0].price);
                              var totalPrice = res[0].price * parseInt(ans.quantity);
                              console.log("Total Cost: " + totalPrice);
                            }
                        );
                      
                    }
                  );
              }
            }else{
              //console.log("Ids do not match");
            }
        }
        

      });
    
    
  });
  
}