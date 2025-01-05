import { Model, DataTypes, Sequelize } from 'sequelize';
import { Team } from './teams.model';

type TargetValuesType = {
  targetedRoomForImprovement: number;
  targetedNumberOfDevelopers: number;
  targetedPercentOfTimeSaved: number;
  team_id: number;
}

class TargetValues extends Model<TargetValuesType> {
  declare targetedRoomForImprovement: number;
  declare targetedNumberOfDevelopers: number;
  declare targetedPercentOfTimeSaved: number;
  declare team_id: number;

  static initModel(sequelize: Sequelize) {
    TargetValues.init({
      targetedRoomForImprovement: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      targetedNumberOfDevelopers: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      targetedPercentOfTimeSaved: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Team,
          key: 'id'
        }
      }
    }, {
      sequelize,
      modelName: 'TargetValues',
      timestamps: false,
    });

    TargetValues.belongsTo(Team, { foreignKey: 'team_id' });
    Team.hasMany(TargetValues, { foreignKey: 'team_id' });
  }
}

export { TargetValues };
