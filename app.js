//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});
const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = {

  name: "Buy food"
}
const item2 = {

  name: "Borrow tools"
}
const item3 = {

  name: "Sell car"
}

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, function (err) {

//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Insert sucess");
//   }
  
// });

app.get("/", function(req, res) {

Item.find({},function (err, foundItems) {
  res.render("list", {listTitle: "Today", newListItems: foundItems});
})


  

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    defaultItems.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
