// usage.model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';
import { UsageBreakdown } from './usageBreakdown.model';

type UsageType = {
  day: Date;
  totalSuggestionsCount: number;
  totalAcceptancesCount: number;
  totalLinesSuggested: number;
  totalLinesAccepted: number;
  totalActiveUsers: number;
  totalChatAcceptances: number;
  totalChatTurns: number;
  totalActiveChatUsers: number;
  org: string | null;
  team: string | null;
}

class Usages extends Model<UsageType> {
  declare day: Date;
  declare totalSuggestionsCount: number;
  declare totalAcceptancesCount: number;
  declare totalLinesSuggested: number;
  declare totalLinesAccepted: number;
  declare totalActiveUsers: number;
  declare totalChatAcceptances: number;
  declare totalChatTurns: number;
  declare totalActiveChatUsers: number;
  declare org: string | null;
  declare team: string | null;

  static initModel(sequelize: Sequelize) {
    Usages.init({
      day: {
        type: DataTypes.DATE,
        primaryKey: true,
        allowNull: false
      },
      totalSuggestionsCount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalAcceptancesCount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalLinesSuggested: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalLinesAccepted: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalActiveUsers: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalChatAcceptances: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalChatTurns: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalActiveChatUsers: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      org: {
        type: DataTypes.STRING,
        allowNull: true
      },
      team: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'Usage',
      tableName: 'Usages',
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