// src/schemas/teams.js
const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');

module.exports = {
  mysql: {
    tableName: 'Teams',
    model: require('../models/teams.model.ts').Team,
    relationships: {
      belongsTo: [
        { model: 'Team', as: 'parent', foreignKey: 'parent_id' }
      ],
      belongsToMany: [
        { model: 'Member', through: 'TeamMemberAssociation', as: 'members' }
      ],
      hasMany: [
        { model: 'Team', as: 'children', foreignKey: 'parent_id' }
      ]
    }
  },
  mongodb: {
    collectionName: 'teams',
    relationships: {
      parent: { ref: 'Team', foreignKey: 'parent_id' },
      children: { ref: 'Team', foreignKey: 'parent_id' },
      members: { ref: 'Member', through: 'TeamMemberAssociation' }
    }
  }
};

// Separate schema for Member
module.exports.Member = {
  mysql: {
    tableName: 'Members',
    model: require('../models/teams.model.js').Member,
    relationships: {
      belongsToMany: [
        { model: 'Team', through: 'TeamMemberAssociation', as: 'teams' }
      ],
      hasMany: [
        { model: 'Seat', as: 'activity', foreignKey: 'assignee_id' }
      ]
    }
  },
  mongodb: {
    collectionName: 'members',
    relationships: {
      teams: { ref: 'Team', through: 'TeamMemberAssociation' },
      activity: { ref: 'Seat', foreignKey: 'assignee_id' }
    }
  }
};