const { MongoClient } = require('mongodb');

const SOURCE_URI = 'mongodb+srv://kumarmangalampatna_db_user:Kukku404%23@brushbackend.l3ulyho.mongodb.net/adladata?appName=BrushBackend';
const TARGET_URI = 'mongodb+srv://umvadla_db_user:LMjD0ZCW16i3w7VJ@umvadla.dlngdbr.mongodb.net/adladata?appName=UMVAdla';

async function migrate() {
    console.log('Connecting to Source DB...');
    const sourceClient = new MongoClient(SOURCE_URI);
    await sourceClient.connect();
    const sourceDb = sourceClient.db(); // connects to adladata

    console.log('Connecting to Target DB...');
    const targetClient = new MongoClient(TARGET_URI);
    await targetClient.connect();
    const targetDb = targetClient.db(); // connects to adladata based on URL

    try {
        const collections = await sourceDb.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        console.log(`Found ${collectionNames.length} collections in source DB:`, collectionNames);

        for (const colName of collectionNames) {
            console.log(`\nMigrating collection: ${colName}...`);
            const sourceCol = sourceDb.collection(colName);
            const targetCol = targetDb.collection(colName);

            // Fetch all documents
            const docs = await sourceCol.find({}).toArray();
            console.log(`Found ${docs.length} documents in ${colName}`);

            if (docs.length > 0) {
                console.log(`Inserting ${docs.length} documents into target ${colName}...`);
                await targetCol.insertMany(docs);
                console.log(`✅ ${colName} migration complete.`);
            } else {
                console.log(`⏩ ${colName} is empty, skipping.`);
            }
        }

        console.log('\n🎉 All collections migrated successfully!');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await sourceClient.close();
        await targetClient.close();
        console.log('Connections closed.');
    }
}

migrate();