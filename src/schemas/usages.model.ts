//usage.model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import { UsageType } from './types';
import { UsageBreakdown } from './usageBreakdown.model';


// ... types remain the same ...

class Usages extends Model<UsageType> {
  declare org: string;
  declare team: string;
  declare day: string;
  declare totalSuggestionsCount: number;
  declare totalAcceptancesCount: number;
  declare totalLinesSuggested: number;
  declare totalLinesAccepted: number;
  declare totalActiveUsers: number;
  declare totalChatAcceptances: number;
  declare totalChatTurns: number;
  declare totalActiveChatUsers: number;

  static initModel(sequelize: Sequelize) {
    Usages.init({
      org: {
        type: DataTypes.STRING,
        allowNull: false
      },
      team: {
        type: DataTypes.STRING,
        allowNull: true
      },
      day: {
        type: DataTypes.DATEONLY,
        primaryKey: true,
        allowNull: false
      },
      totalSuggestionsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalAcceptancesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalLinesSuggested: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalLinesAccepted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalActiveUsers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalChatAcceptances: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalChatTurns: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalActiveChatUsers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    }, {
      sequelize,
      modelName: 'Usage',
      tableName: 'Usages', // explicitly set table name
      timestamps: false,
      indexes: [
        {
          fields: ['org', 'day']
        }
      ]
    });

    // Initialize UsageBreakdown after Usage is initialized
    UsageBreakdown.initModel(sequelize);

    // Set up associations
    Usages.hasMany(UsageBreakdown, { 
      foreignKey: 'usage_day',
      sourceKey: 'day'
    });
  }
}

export { Usages, UsageBreakdown };