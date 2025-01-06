import { DataTypes, Model, Sequelize } from 'sequelize';
import { UsageBreakdownType } from './types';
import { Usages } from './usages.model';

export class UsageBreakdown extends Model<UsageBreakdownType> {
  declare id: number;
  declare usage_day: string;
  declare language: string;
  declare editor: string;
  declare suggestionsCount: number;
  declare acceptancesCount: number;
  declare linesSuggested: number;
  declare linesAccepted: number;
  declare activeUsers: number;

  static initModel(sequelize: Sequelize) {
    UsageBreakdown.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      usage_day: {
        type: DataTypes.DATEONLY,
        references: {
          model: Usages,
          key: 'day',
        },
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      editor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      suggestionsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      acceptancesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      linesSuggested: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      linesAccepted: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activeUsers: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      modelName: 'UsageBreakdown',
      tableName: 'UsageBreakdown',
      timestamps: false,
    });

    // Set up the belongsTo relationship
    UsageBreakdown.belongsTo(Usages, { 
      foreignKey: 'usage_day',
      targetKey: 'day'
    });
  }
}