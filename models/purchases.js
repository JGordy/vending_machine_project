'use strict';
module.exports = function(sequelize, DataTypes) {
  var Purchase = sequelize.define('Purchase', {
    itemId: DataTypes.INTEGER,
    money_given: DataTypes.INTEGER
  }, {});

  Purchase.associate = function(models) {
    Purchase.belongsTo(models.Item, {
      as: "Items",
      foreignKey: "itemId"
    })
  }

  return Purchase;
};
