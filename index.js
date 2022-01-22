const express = require("express");
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ceufq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
  try {
    await client.connect();
    console.log('hitting database')
    const database = client.db('all_users');
    const users = database.collection('users_list');
    const bloodpost = client.db('all_bloodpost');
    const bloodpostData = bloodpost.collection('all_bloodpostData');
    const adminPanel = client.db('all_admin');
    const adminpanelData = adminPanel.collection('all_adminData');



    app.post("/alluser", async (req, res) => {
      const user = req.body;
      const result = await users.insertOne(user);
      res.json(result);
  });
    app.post("/bloodpost", async (req, res) => {
      const user = req.body;
      const result = await bloodpostData.insertOne(user);
      res.json(result);
  });


    app.post("/publicpost/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await bloodpostData.findOne(query);
      const result = await adminpanelData.insertOne(product);
      res.json(result);
  });

    app.get('/alluser', async (req, res) => {
        const cursor = users.find({});
        const products = await cursor.toArray();
        res.send(products);
    });
  
    app.get('/bloodpost', async (req, res) => {
        const cursor = bloodpostData.find({});
        const allpost = await cursor.toArray();
        res.send(allpost);
    });
    app.get('/registereduser', async (req, res) => {
        const cursor = users.find({});
        const allpost = await cursor.toArray();
        res.send(allpost);
    });
    app.get('/getdata', async (req, res) => {
        const cursor = adminpanelData.find({});
        const allpost = await cursor.toArray();
        res.send(allpost);
    });
    app.get("/mypost/:email", async (req, res) => {
      const email = req.params.email;
      const result = await bloodpostData.find({ registeremail: email }).toArray();
      res.send(result);
      console.log(result);
  });

    app.delete("/bloodpost/:id", async (req, res) => {
        const id = req.params.id ;
        const query = {_id: ObjectId(id)}
        const result = await bloodpostData.deleteOne(query);
        console.log(result);
        res.json(result);
    });
    app.delete("/deletepending/:id", async (req, res) => {
        const id = req.params.id ;
        const query = {_id: ObjectId(id)}
        const result = await bloodpostData.deleteOne(query);
        console.log(result);
        res.json(result);
    });
   


  }
  finally {
    // await client.close();

  }

}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send('Successfully')
})
app.listen(port, () => {
  console.log('Successfully')
})

