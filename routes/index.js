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
      data = {"status": "success", data: data};
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(data);
    } else {
      res.send("No items found");
    }
  })
  .catch(function(err) {
    res.status(500).send("Whoops, my bad. Internal Error...")
  });
});


//√ purchase an item √
router.post("/api/customer/items/:itemId/purchases", function(req,res) {

  models.Item.findOne({
      where: {id: req.params.itemId}
  })
  .then(function(item) {
    if (req.body.moneyPaid < item.cost) {
      let error = {
        "status": "fail",
        "data": {
          "moneyPaid": req.body.moneyPaid,
          "moneyRequired": item.cost
        }
      }
      res.status(400).send(error)
    } else if (item.quantity < 1) {
      let error = {
        "status": "fail",
        "data": {
          "item": item.item,
          "quantity": item.quantity
        }
      }
      res.status(400).send(error);
    } else {
      let change = req.body.moneyPaid - item.cost;
      models.Item.update({quantity: item.quantity - 1}, {
         where: {id: req.params.itemId}
       })
       .then(function(data) {
         models.Purchase.create({
           itemId: item.id,
           moneyPaid: req.body.moneyPaid - change
         })
         .then(function(data) {
           res.setHeader("Content-Type", "application/json");
           data = {"status": "success", "yourChange": change, item: item, data: data};
           res.status(200).send(data)
         })
         .catch(function(err) {
           err = {"status": "fail", error: err};
           res.status(500).res.send(err)
         })
       })
    }

  })
  .catch(function(err) {
    res.status(500).send("Whoops, my bad. Internal Error...")
  });

});


//√ get a list of all purchases with their item and date/time √
router.get("/api/vendor/purchases", function(req, res) {

  models.Purchase.findAll({
    include: [
    {model: models.Item, as: 'Items'}
  ]
  })
  .then(function(data) {
    data = {"status": "success", data: data};
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(data);
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).send(err)
  });
});


//√ get a total amount of money accepted by the machine √
router.get("/api/vendor/money", function(req, res) {
  models.Purchase.findAll({})
  .then(function(data) {
    models.Purchase.sum("moneyPaid")
    .then(function(data) {
      data = {"status": "success", data: {totalMoney: data}};
      res.send(data)
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
    data = {"status": "success", data: data};
    res.status(201).send(data);
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).json(err)
  })
});


//√ update item quantity, description, and cost √
router.put("/api/vendor/items/:itemId", function(req, res) {
  models.Item.update({
    item: req.body.item,
    cost: req.body.cost,
    quantity: req.body.quantity
  }, {
    where: {
      id: req.body.id
    }
  })
  .then(function(data) {
    data = {"status": "success", data: data};
    res.status(204).send(data)
  })
  .catch(function(err) {
    err = {"status": "fail", error: err};
    res.status(500).res.send(err)
  })
});


module.exports = router;
