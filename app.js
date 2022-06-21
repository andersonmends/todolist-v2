//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({

  name: "Buy food"
});

const item2 = new Item({

  name: "Borrow tools"
});
const item3 = new Item({

  name: "Sell car"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

  Item.find({}, function (err, foundItems) {

    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Insert sucess");
          }

        });
      }

      console.log("Find items");
    }

    res.render("list", { listTitle: "Today", newListItems: foundItems });
  })

});

app.post("/", function (req, res) {

  const itemReq = req.body.newItem;

  const item = new Item({

    name: itemReq
  });

  item.save()
  res.redirect("/");

});

app.post("/delete", function (req, res) {

  const itemId = req.body.checkbox;
  console.log(itemId);
  Item.findByIdAndRemove(itemId, function (err) {
    if (!err) {
      console.log("Successfully remove");
    }
  })
  res.redirect("/");

});

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;
  List.findOne({ name: customListName }, function (err, foundItem) {
    if (!err) {
      if (!foundItem) {

        const list = new List({
          name: customListName,
          items: defaultItems
        })

        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", { listTitle: customListName, newListItems: foundItem.items });
      }
    }
  })

});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
