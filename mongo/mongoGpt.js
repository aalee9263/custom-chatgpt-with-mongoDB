const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://user123:user123@mongoyoutube.t71dy.mongodb.net/?retryWrites=true&w=majority&appName=MongoYoutube";

  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make a sample query to check connection
    const database = client.db("test");
    const collection = database.collection("testCollection");
    const document = await collection.findOne({});

    console.log("Connected successfully:", document);
  } finally {
    // Close the connection
    await client.close();
  }
}

main().catch(console.error);
