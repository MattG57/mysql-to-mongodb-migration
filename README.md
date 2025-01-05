# MySQL to MongoDB Migration Tool

A flexible and extensible tool for migrating data from MySQL to MongoDB. This tool maintains relationships between collections and supports custom data transformations.

## Features

- 🔄 Automated schema loading and migration
- 🔗 Preserves relationships between collections
- 🚀 Batch processing for large datasets
- ✨ Custom data transformations
- 🧪 Test data generation
- 📝 Progress tracking and logging

## Prerequisites

- Node.js (v14 or higher)
- MySQL server
- MongoDB server
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/mysql-to-mongodb-migration.git
cd mysql-to-mongodb-migration
```

2. Install dependencies:
```bash
npm install
```

3. Create your .env file:
```bash
cp .env.example .env
```

4. Configure your database connections in `.env`:
```env
MYSQL_HOST=localhost
MYSQL_DATABASE=your_database
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_PORT=3306

MONGODB_URI=mongodb://localhost:27017/your_database
```

## Project Structure

```
src/
├── schemas/           # Schema definitions
│   ├── index.js      # Schema loader
│   ├── user.js       # User schema
│   ├── post.js       # Post schema
│   └── ...           # Other schemas
├── config/
│   └── database.js   # Database configuration
├── migration-utilities.js
└── index.js          # Entry point
```

## Usage

1. Define your schemas in the `src/schemas` directory
2. Configure your database connections in `.env`
3. Run the migration:

```bash
npm run migrate
```

### Adding New Schemas

1. Create a new file in `src/schemas/` (e.g., `comment.js`)
2. Define both MySQL and MongoDB schemas
3. Export the schema configuration

Example schema file:
```javascript
const { DataTypes } = require('sequelize');
const mongoose = require('mongoose');

module.exports = {
  mysql: {
    tableName: 'comments',
    attributes: {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      content: DataTypes.TEXT
    },
    relationships: {
      belongsTo: ['User', 'Post']
    }
  },
  mongodb: {
    collectionName: 'comments',
    schema: {
      content: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
    },
    transform: (mysqlData) => ({
      content: mysqlData.content
    })
  }
};
```

## Configuration Options

### Batch Size
Modify batch size in `src/index.js`:
```javascript
await migrationManager.migrateAll({ batchSize: 1000 });
```

### Custom Transformations
Add custom transformations in your schema files:
```javascript
transform: (mysqlData) => ({
  // Custom transformation logic
  name: `${mysqlData.firstName} ${mysqlData.lastName}`,
  email: mysqlData.email.toLowerCase()
})
```

## Testing

1. Generate test data:
```bash
npm run generate-test-data
```

2. Run a test migration:
```bash
npm run test-migrate
```

## Error Handling

The migration process includes:
- Progress tracking
- Error logging
- Ability to resume failed migrations
- Data validation

If a migration fails, check the logs in `migration.log` for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- [Sequelize](https://sequelize.org/) - MySQL ORM
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
- [Faker](https://fakerjs.dev/) - Test data generation
