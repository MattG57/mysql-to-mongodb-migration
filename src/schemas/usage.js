const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');

module.exports = {
  mysql: {
    tableName: 'Usage',
    model: require('../models/usage.model.ts').Usage,
    relationships: {
      hasMany: [
        { model: 'UsageBreakdown', as: 'breakdowns', foreignKey: 'usage_day' }
      ]
    }
  },
  mongodb: {
    collectionName: 'usage',
    relationships: {
      breakdowns: { ref: 'UsageBreakdown', foreignKey: 'usage_day' }
    }
  }
};
