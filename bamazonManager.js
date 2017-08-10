var mysql = require("mysql");
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
  // run the start function after the connection is made to prompt the user
  menu();
});

// function which prompts the user for what action they should take
function menu() {
  inquirer
    .prompt({
      name: "menuOptions",
      type: "rawlist",
      message: "Please choose one of the options below: ",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory","Add New Product"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.menuOptions === "View Products for Sale") {
        merchandise();
      }
      else if (answer.menuOptions === "View Low Inventory"){
        lowMerchandise();
      }
    });


function merchandise(){
  connection.query("SELECT * FROM products", function(err,res){
    console.log("Item ID " + " | " + " Product Name " + " | " + " Price " + " | " + "Quantity");
    console.log("-----------------------------------");
    for(var i = 0; i < res.length; i++){
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
    //chooseMerchandise();
  });
  
}

function lowMerchandise(){
  connection.query("SELECT * FROM products", function(err,res){
    console.log("Item ID " + " | " + " Product Name " + " | " + " Price " + " | " + "Quantity");
    console.log("-----------------------------------");
    for(var i = 0; i < res.length; i++){
      if(res[i].stock_quantity < 5){
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
      }else {
        console.log("We are fully stocked!");
      }
      
    }
    console.log("-----------------------------------");
    //chooseMerchandise();
  });
  
}