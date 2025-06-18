const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const User = require('./User')(sequelize, DataTypes);
const TravelRequest = require('./TravelRequest')(sequelize, DataTypes);
const Bid = require('./Bid')(sequelize, DataTypes);
const CreditTransaction = require('./CreditTransaction')(sequelize, DataTypes);

const models = {
  User,
  TravelRequest,
  Bid,
  CreditTransaction
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, models };