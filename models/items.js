'use strict';
module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    item: DataTypes.STRING,
    cost: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {});

  Item.associate = function(models) {
    Item.hasMany(models.Purchase, {
      as: "Purchases",
      foreignKey: "itemId"
    })
  };

  return Item;
};
