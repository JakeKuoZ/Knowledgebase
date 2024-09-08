const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings.json');
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

// Function to connect to the MongoDB database
const dbConnection = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        _db = await _connection.db(mongoConfig.database);
        console.log('Connected to the MongoDB database');
    }

    return _db;
};

// Function to close the connection (optional, if you want to manually close it)
const closeConnection = () => {
    if (_connection) {
        _connection.close();
        console.log('MongoDB connection closed');
    }
};

// Collection getter function factory to ensure the connection is established
const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection(); // Ensure the database is connected
            _col = await db.collection(collection); // Get the specified collection
        }

        return _col;
    };
};

// Exported modules: collections and connection functions
module.exports = {
    dbConnection,
    closeConnection,
    users: getCollectionFn("Users"), // Export the "Users" collection
    articles: getCollectionFn("Articles"), // Example for another collection, like "Articles"
};