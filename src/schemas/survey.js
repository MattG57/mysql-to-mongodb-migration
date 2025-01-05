const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');

module.exports = {
  mysql: {
    tableName: 'Surveys',
    model: require('../models/survey.model.ts').Survey,
    relationships: {
      belongsTo: []
    }
  },
  mongodb: {
    collectionName: 'surveys',
    relationships: {}
  }
};
