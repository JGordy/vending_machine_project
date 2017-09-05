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


//√ get a list of items  √
router.get("/api/customer/items", function(req, res) {
  models.Item.findAll({})
  .then(function(data) {
    if (data) {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(data);
    } else {
      res.send("No items found");
    }
  })
  .catch(function(err) {
    res.status(500).send("Whoops, my bad. Internal Error...")
  });
});


// purchase an item
router.post("/api/customer/items/:itemId/purchases", function(req,res) {
  let purchaseItems = {
    itemId: req.params.itemId,
    moneyPaid: req.body.moneyPaid
  }
  models.Purchase.create(purchaseItems)
  .then(function(data) {
    res.status(201).send(data);
  })
  .catch(function(err) {
    res.status(500).json(err)
  })
});


//√ get a list of all purchases with their item and date/time √
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


//√ get a total amount of money accepted by the machine √
router.get("/api/vendor/money", function(req, res) {
  models.Purchase.findAll({})
  .then(function(data) {
    models.Purchase.sum("moneyPaid")
    .then(function(data) {
      res.json(data)
    })
  })
});


//√ add a new item not previously existing in the machine √
router.post("/api/vendor/items", function(req, res) {

  let itemObject = {
    item: req.body.item,
    cost: req.body.cost,
    quantity: req.body.quantity
  }

  models.Item.create(itemObject)
  .then(function(data) {
    res.status(201).send(data);
  })
  .catch(function(err) {
    res.status(500).json(err)
  })
});


// update item quantity, description, and cost
router.put("/api/vendor/items/:itemId", function(req, res) {
  models.Item.update({
    item: req.body.item,
    cost: req.body.cost,
    quantity: req.body.quantity
  }, {
    where: {
      id: req.params.id
    }
  })
  .then(function(data) {
    res.status(204).send("Update successful")
  })
  .catch(function(err) {
    res.status(403).res.send("Sorry for our technical hiccups")
  })
});


module.exports = router;
