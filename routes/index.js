const express = require("express");
const models = require("../models/index")
const router = express.Router();
const Sequelize = require("sequelize");


router.get("/", function(req, res) {
  res.redirect("/api");
});

router.get("/api", function(req, res){
  res.status(200).send("My API documentation");
});

// get a list of items
router.get("/api/customer/items", function(req, res) {
  models.Item.findAll({})
  .then(function(data) {
    if (data) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(data);
    } else {
      res.status(404).send("No items found");
    }
  })
  .catch(function(err) {
    res.status(500).send("Whoops, my bad. Internal Error...")
  });
});

// purchase an item
router.post("/api/customer/items/:itemId/purchases", function(req,res) {
  
});



// get a list of all purchases with their item and date/time
router.get("/api/vendor/purchases", function(req, res) {

  models.Purchase.findAll({
    include: [
    {model: models.Item, as: 'Items'}
  ]
  })
  .then(function(data) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(data);
  })
  .catch(function(err) {
    res.status(500).send("Whoops, my bad. Internal Error...")
  });
});



// get a total amount of money accepted by the machine
router.get("/api/vendor/money", function(req, res) {

});



// add a new item not previously existing in the machine
router.post("/api/vendor/items", function(req, res) {

  let itemObject = {
    item: req.body.item,
    cost: Number(req.body.cost),
    quantity: Number(req.body.quantity)
  }

  models.Item.create(itemObject)
  .then(function(data) {
    res.setHeader("Content-Type", "application/json");
    res.status(201);
  })
  .catch(Sequelize.SequelizeForeignKeyConstraintError, function(err) {
    res.status(404).send("Constraint Key Error")
  })
  .catch(Sequelize.DatabaseError, function(err) {
    res.status(404).send("Database Error")
  })
  .catch(Sequelize.AssociationError, function(err) {
    res.status(404).send("AssociationError")
  })
  .catch(function(err) {
    res.status(500).json(err);
  })
});



// update item quantity, description, and cost
router.put("/api/vendor/items/:itemId", function(req, res) {
  models.Item.update({
    item: req.body.item,
    cost: req.body.cost,
    quantity: req.body.quantity
  })
  .then(function(data) {
    res.status(204).send("Update successful")
  })
  .catch(function(err) {
    res.status(403).res.send("Sorry for our technical hiccups")
  })
});



module.exports = router;
