// src/index.ts
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { initialize } from './migration-utilities';
import { Team, Member } from './schemas/teams.model';
import { Seat } from './schemas/copilot.seats.model';
import { Settings } from './schemas/settings.model';
import { Usages } from './schemas/usages.model';
//import { TargetValues } from './schemas/target-values.model';
import { Survey } from './schemas/survey.model';


dotenv.config();

async function main() {
  try {
    // Initialize Sequelize connection with explicit dialect
    const sequelize = new Sequelize(
      process.env.MYSQL_DATABASE || 'your_database',
      process.env.MYSQL_USER || 'your_user',
      process.env.MYSQL_PASSWORD || 'your_password',
      {
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        dialect: 'mysql',  // Add this explicit dialect
        logging: console.log
      }
    );
    // Initialize Usage model
    Member.initModel(sequelize);
    Team.initModel(sequelize);
    Seat.initModel(sequelize);
    Settings.initModel(sequelize);
    //TargetValues.initModel(sequelize);
    Survey.initModel(sequelize);
    Usages.initModel(sequelize);

    // Diagnostic check 1: Check if Usage model is properly initialized
    console.log('Usage model attributes:', Object.keys(Usages.getAttributes()));

    // Diagnostic check 2: Count records in MySQL
    const mysqlCount = await Usages.count();
    console.log(`MySQL Usage table count: ${mysqlCount}`);

    // Diagnostic check 3: Sample record
    const sampleRecord = await Usages.findOne();
    console.log('Sample MySQL record:', sampleRecord?.toJSON());

    await sequelize.authenticate();
    console.log('MySQL connection has been established successfully.');

    const { migrationManager } = await initialize({
      models: {
        Member,
        Team,
        Seat,
        Settings,
     //   TargetValues,
        Survey,
        Usages
      },
      mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27027/your_database'
      }
    });

    // Diagnostic check 4: Log migration manager state
    console.log('Migration manager initialized with models:', 
      Object.keys(migrationManager['sequelizeModels']));

    await migrationManager.migrateAll();
    
    // Diagnostic check 5: Count records in MongoDB after migration
    const MongoModel = migrationManager['mongoModels']['Usage'];
    if (MongoModel) {
      const mongoCount = await MongoModel.countDocuments();
      console.log(`MongoDB Usage collection count: ${mongoCount}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}