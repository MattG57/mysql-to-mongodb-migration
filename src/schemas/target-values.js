const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');

module.exports = {
  mysql: {
    tableName: 'TargetValues',
    model: require('../models/target-values.model.ts').TargetValues,
    relationships: {
      belongsTo: []
    }
  },
  mongodb: {
    collectionName: 'target_values',
    relationships: {}
  }
};
