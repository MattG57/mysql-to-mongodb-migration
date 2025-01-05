const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');

module.exports = {
  mysql: {
    tableName: 'Settings',
    model: require('../models/settings.model.ts').Settings,
    relationships: {
      belongsTo: []
    }
  },
  mongodb: {
    collectionName: 'settings',
    relationships: {}
  }
};
