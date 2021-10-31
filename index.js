const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qxqgc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("raikaUser");
    const itemsCollection = database.collection("items");
    // GET API


    app.get("/items", async(req, res)=>{
        const cursor = itemsCollection.find({});
        const items = await cursor.toArray();
        res.send(items);
    });

    // GET Single items
    app.get('/items/:_id', async(req, res) => {
        const _id = req.params._id;
        console.log('getting specific item' , _id);
        const query = {_id: ObjectId(_id)};
        const item = await itemsCollection.findOne(query);
        res.json(item);
    });

    //POST API
    app.post("/items", async (req, res) => {
        const item = req.body;
      console.log("hit the post api", item);
      const result = await itemsCollection.insertOne(item);
      console.log(result);
      res.json(result);
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running resort server");
});
app.listen(port, () => {
  console.log("running resort on port", port);
});
