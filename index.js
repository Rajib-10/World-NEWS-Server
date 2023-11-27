const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fzaqft4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const userCollection = client.db("newsDB").collection("users");
    const publishersCollection = client.db("newsDB").collection("publishers");
    const articleCollection = client.db("newsDB").collection("articles");

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // make admin
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });


    // publisher related api

    app.get("/publishers", async (req, res) => {
      const result = await publishersCollection.find().toArray();
      res.send(result);
    });

    app.post('/publishers',async(req,res)=>{
      const publisher = req.body; 
      const result = await publishersCollection.insertOne(publisher);
      res.send(result);
    })

    // articles related api

    app.get("/articles", async (req, res) => {
      const result = await articleCollection.find().toArray();
      res.send(result);
    });

    app.post('/articles',async(req,res)=>{
      const article = req.body; 
      const result = await articleCollection.insertOne(article);
      res.send(result);
    })

    app.delete("/articles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await articleCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/articles/:id",async(req,res)=>{
      const id = req.params.id;
      const data = req.body
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          title: data.title,
          description: data.description,
          publisher: data.publisher,
          tags: data.tags,
          image: data.image
        },
      };
      const result = await articleCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

     // article approve
     app.patch("/articles/approve/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: "approved",
        },
      };
      const result = await articleCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

     // article premium
     app.patch("/articles/premium/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          isPremium: true,
        },
      };
      const result = await articleCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });


     // article decline
     app.patch("/articles/decline/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: "declined",
           message: data.message
        },
      };
      const result = await articleCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    
    

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("World NEWS is running...");
});

app.listen(port, () => {
  console.log(`World NEWS is running on port ${port}`);
});
