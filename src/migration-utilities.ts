// src/migration-utilities.ts
import { Model, ModelStatic, ModelAttributes, ModelAttributeColumnOptions, DataType, ModelAttributeColumnReferencesOptions } from 'sequelize';
import mongoose, { Schema, Model as MongooseModel } from 'mongoose';
import { ObjectId } from 'mongodb'; // Import ObjectId

interface Config {
  models: {
    [key: string]: ModelStatic<Model<any, any>>;
  };
  mongodb: {
    uri: string;
  };
}

// Define the SequelizeRecord type
interface SequelizeRecord {
  id: number;
  assignee_id?: number; // Add assignee_id field
  [key: string]: any;
}

interface ModelReference {
  model: string | { name: string };
  key?: string;
}

interface RefModel {
  model: string | { name: string } | undefined;
  key?: string;
}

class MigrationManager {
  private sequelizeModels: { [key: string]: ModelStatic<Model<any, any>> };
  private mongoUri: string;
  private mongoModels: { [key: string]: MongooseModel<any> };
  private idMappings: Map<string, string>;

  constructor(models: { [key: string]: ModelStatic<Model<any, any>> }, mongoUri: string) {
    this.sequelizeModels = models;
    this.mongoUri = mongoUri;
    this.mongoModels = {};
    this.idMappings = new Map();
  }

  async connect(): Promise<void> {
    try {
      await mongoose.connect(this.mongoUri);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  private mapSequelizeType(sequelizeType: DataType): any {
    const typeStr = sequelizeType.toString({});  // Added empty object parameter
    if (typeStr.includes('VARCHAR') || typeStr.includes('TEXT')) return String;
    if (typeStr.includes('INT')) return Number;
    if (typeStr.includes('DATE')) return Date;
    if (typeStr.includes('BOOLEAN')) return Boolean;
    return String;
  }

  private getRefModelName(references: ModelAttributeColumnReferencesOptions): string {
    if (!references.model) {
      return 'Unknown';
    }
    if (typeof references.model === 'string') {
      return references.model;
    }
    return references.model.name || 'Unknown';
  }

  initializeMongoModels(): void {
    Object.entries(this.sequelizeModels).forEach(([modelName, model]) => {
      const attributes = model.getAttributes() as ModelAttributes<Model<any, any>>;
      const schemaDefinition: { [key: string]: any } = {};
      
      Object.entries(attributes).forEach(([field, attr]) => {
        if (field === 'id') return;
        
        const columnOptions = attr as ModelAttributeColumnOptions;
        // Special handling for foreign key fields
        if (field === 'assignee_id' || field === 'assigning_team_id' || field === 'parent_id') {
          // Store these as Numbers initially
          schemaDefinition[field] = {
            type: Number,
            ref: columnOptions.references ? 
              this.getRefModelName(columnOptions.references as ModelAttributeColumnReferencesOptions) : 
              null
          };
        } else if (columnOptions.references) {
          schemaDefinition[field] = {
            type: Schema.Types.ObjectId,
            ref: this.getRefModelName(columnOptions.references as ModelAttributeColumnReferencesOptions)
          };
        } else {
          schemaDefinition[field] = this.mapSequelizeType(columnOptions.type);
        }
      });
  
      const schema = new Schema(schemaDefinition, {
        timestamps: true
      });
  
      // Clear existing model if it exists
      try {
        mongoose.deleteModel(modelName);
      } catch (e) {
        // Model doesn't exist yet, which is fine
      }
      
      // Create new model
      this.mongoModels[modelName] = mongoose.model(modelName, schema);
    });
  }

  private async migrateModel(
    modelName: string, 
    SequelizeModel: ModelStatic<Model<any, any>>, 
    batchSize: number
  ): Promise<void> {
    const MongoModel = this.mongoModels[modelName];
    let offset = 0;
    let totalMigrated = 0;
    let duplicateCount = 0;
    
    // Get initial counts
    const sourceCount = await SequelizeModel.count();
    const initialMongoCount = await MongoModel.countDocuments();
    
    console.log(`\n${modelName} Migration Stats:`);
    console.log(`Source MySQL rows: ${sourceCount}`);
    console.log(`Initial MongoDB count: ${initialMongoCount}`);
    
    while (true) {
      const records = (await SequelizeModel.findAll({
        limit: batchSize,
        offset: offset,
        raw: true
      })) as unknown as Record<string, any>[];
  
      if (records.length === 0) break;
  
      // Track unique IDs to avoid duplicates
      const batchIds = new Set(records.map(r => r.id));
      console.log(`Batch size: ${records.length}, Unique IDs in batch: ${batchIds.size}`);
  
      const documents = records.map(record => {
        const { id, ...data } = record as { id?: number; [key: string]: any };
  
        // Handle foreign key fields
        if (modelName === 'Seat') {
          data.assignee_id = record.assignee_id;
          data.assigning_team_id = record.assigning_team_id;
        } else if (modelName === 'Team') {
          data.parent_id = record.parent_id;
        }
  
        const mongoDoc = new MongoModel(data);
        if (id !== undefined) {
          this.idMappings.set(`${modelName}-${id}`, mongoDoc._id.toString());
        }
        return mongoDoc;
      });
  
      try {
        await MongoModel.insertMany(documents, { ordered: true });
        totalMigrated += documents.length;
        offset += records.length;
        
        // Log progress with more detail
        const progress = Math.round((offset/sourceCount)*100);
        console.log(`Migrated batch at offset ${offset}/${sourceCount} (${progress}%)`);
        console.log(`Total migrated so far: ${totalMigrated}`);
        
      } catch (error) {
        console.error(`Error in batch starting at offset ${offset}:`, error);
        throw error;
      }
    }
  
    // Final verification
    const finalMongoCount = await MongoModel.countDocuments();
    console.log('\nMigration Summary:');
    console.log(`- Source MySQL count: ${sourceCount}`);
    console.log(`- Records processed: ${totalMigrated}`);
    console.log(`- Final MongoDB count: ${finalMongoCount}`);
    
    if (sourceCount !== finalMongoCount) {
      console.warn(`⚠️ Count mismatch: MySQL=${sourceCount}, MongoDB=${finalMongoCount}`);
    } else {
      console.log('✓ Source and destination counts match');
    }
  }

  async updateTeamRelationships(): Promise<void> {
    console.log('Updating team parent relationships...');
    const TeamModel = this.mongoModels['Team'];
    
    const teams = await TeamModel.find({});
    for (const team of teams) {
      const parentId = (team as any).parent_id;
      if (parentId) {
        const parentMongoId = this.idMappings.get(`Team-${parentId}`);
        if (parentMongoId) {
          (team as any).parent = parentMongoId;
          await team.save();
        }
      }
    }
  }

  async migrateAll(batchSize = 1000): Promise<void> {
    try {
      await this.connect();
      this.initializeMongoModels();

      for (const [modelName, SequelizeModel] of Object.entries(this.sequelizeModels)) {
        console.log(`Migrating ${modelName}...`);
        await this.migrateModel(modelName, SequelizeModel, batchSize);
      }

      await this.updateTeamRelationships();
      await this.updateRelationships();

      console.log('Migration completed successfully');
    } catch (error) {
      console.error('Migration failed:', error instanceof Error ? error.message : String(error));
      throw new Error(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async updateRelationships(): Promise<void> {
    console.log('Updating relationships...');

    for (const [modelName, MongoModel] of Object.entries(this.mongoModels)) {
      const foreignKeyFields = this.getForeignKeyFields(MongoModel.schema);

      if (foreignKeyFields.length === 0) continue;

      const documents = await MongoModel.find({});
      
      for (const doc of documents) {
        let updated = false;

        for (const { path, ref } of foreignKeyFields) {
          const oldId = (doc as any)[path];
          if (oldId) {
            const newId = this.idMappings.get(`${ref}-${oldId}`);
            if (newId) {
              (doc as any)[path] = newId;
              updated = true;
            }
          }
        }

        if (updated) {
          await doc.save();
        }
      }
    }
  }

  private getForeignKeyFields(schema: Schema): Array<{ path: string; ref: string }> {
    const foreignKeys: Array<{ path: string; ref: string }> = [];
    schema.eachPath((path: string, type: any) => {
      if (type.options.ref) {
        foreignKeys.push({
          path,
          ref: type.options.ref
        });
      }
    });
    return foreignKeys;
  }
}

export async function initialize(config: Config) {
  const migrationManager = new MigrationManager(
    config.models,
    config.mongodb.uri
  );
  
  return { migrationManager };
}