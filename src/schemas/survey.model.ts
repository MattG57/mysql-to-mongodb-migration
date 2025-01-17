import { Model, DataTypes, Sequelize, CreationOptional } from 'sequelize';

type SurveyType = {
  id?: number;
  org: string;
  repo: string;
  prNumber: number | null;
  status: 'pending' | 'completed';
  hits: number | null;
  userId: string | null;
  usedCopilot: boolean;
  percentTimeSaved: number;
  timeUsedFor: string;
  reason: string | null;
  //kudos?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Survey extends Model<SurveyType> {
  declare id?: number;
  declare org: string;
  declare repo: string;
  declare prNumber: number | null;
  declare status: 'pending' | 'completed';
  declare hits: number | null;
  declare userId: string | null;
  declare usedCopilot: boolean;
  declare percentTimeSaved: number;
  declare timeUsedFor: string;
  declare reason: string | null;
  //declare kudos: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initModel(sequelize: Sequelize) {
    Survey.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hits: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      usedCopilot: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      percentTimeSaved: {
        type: DataTypes.INTEGER,
        allowNull: false,
        set(value: number) {
          this.setDataValue('percentTimeSaved', !this.usedCopilot ? 0 : value);
        }
      },
      reason: {
        type: DataTypes.STRING(4096),
        allowNull: true,
      },
      timeUsedFor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      org: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      repo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // kudos: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    }, {
      sequelize,
      modelName: 'Survey',
      tableName: 'Surveys', // explicitly set table name
      timestamps: true,
    });
  }
}

export { Survey, SurveyType };
