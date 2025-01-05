// src/index.ts
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { initialize } from './migration-utilities';
import { Team, Member } from './schemas/teams.model';
import { Seat } from './schemas/copilot.seats.model';

dotenv.config();

async function main() {
  try {
    // Initialize Sequelize connection
    const sequelize = new Sequelize({
      host: process.env.MYSQL_HOST || 'localhost',
      database: process.env.MYSQL_DATABASE,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      dialect: 'mysql',
      port: parseInt(process.env.MYSQL_PORT || '3306')
    });

    // Initialize the models
    Team.initModel(sequelize);
    Member.initModel(sequelize);
    Seat.initModel(sequelize);

    // Test MySQL connection
    await sequelize.authenticate();
    console.log('MySQL connection has been established successfully.');

    // Now proceed with migration
    const { migrationManager } = await initialize({
      models: {
        Team,
        Member,
        Seat
      },
      mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27027/your_database'
      }
    });

    await migrationManager.migrateAll();
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