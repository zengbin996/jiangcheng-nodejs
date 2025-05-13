const { MongoClient, ServerApiVersion } = require('mongodb');
const { MONGODB_URL } = process.env;

async function connect() {
  const client = new MongoClient(MONGODB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  const db = client.db('jiangcheng');
  return db;
}

module.exports = { connect };
