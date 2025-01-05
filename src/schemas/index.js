const fs = require('fs');
const path = require('path');

// Automatically load all schema files
const loadSchemas = () => {
  const schemas = {};
  const schemaFiles = fs.readdirSync(__dirname)
    .filter(file => 
      file !== 'index.js' && 
      file.endsWith('.js')
    );

  for (const file of schemaFiles) {
    const modelName = path.basename(file, '.js');
    // Convert filename to PascalCase for model name
    const formattedModelName = modelName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    schemas[formattedModelName] = require(`./${file}`);
  }

  return schemas;
};

module.exports = loadSchemas();
