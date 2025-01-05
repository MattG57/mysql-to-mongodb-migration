// src/schemas/copilot-seats.js
const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');

module.exports = {
  mysql: {
    // Use your existing Sequelize model definition
    tableName: 'Seats',
    model: require('../models/copilot.seats.model.ts').Seat,
    relationships: {
      belongsTo: [
        { model: 'Member', as: 'assignee', foreignKey: 'assignee_id' },
        { model: 'Team', as: 'assigning_team', foreignKey: 'assigning_team_id' }
      ]
    }
  },
  mongodb: {
    collectionName: 'seats',
    // Only define how relationships should be stored in MongoDB
    relationships: {
      assignee: { ref: 'Member', foreignKey: 'assignee_id' },
      assigning_team: { ref: 'Team', foreignKey: 'assigning_team_id' }
    }
  }
};
