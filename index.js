const express = require('express')
const cors = require('cors')
// const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const { query } = require('express')
require('dotenv').config()


const app = express()
const port = process.env.PORT || 8000

// middlewares
app.use(cors())
app.use(express.json())

// Database Connection


const uri = "mongodb+srv://nextJS:YB6r3QdYUV3yO4nc@cluster0.j4x9j8z.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run() {
  try {
    // const usersCollection = client.db("nextJSToDO").collection("users"); 
    const taskCollection = client.db("nextJSToDO").collection("task"); 
    const completeCollection = client.db("nextJSToDO").collection("completed"); 
    const commentsCollection = client.db("nextJSToDO").collection("comments"); 
    

    app.post("/addtask", async (req, res) => {
        const task = req.body;
        const result = await taskCollection.insertOne(task);
        res.send(result);
      });
    app.post("/addComments", async (req, res) => {
        const comments = req.body;
        const result = await commentsCollection.insertOne(comments);
        res.send(result);
      });
      app.get("/comments", async (req, res) => {
        const comments = req.body;
        const tasked = await commentsCollection.find(comments).toArray();
        res.send(tasked);
      });
      app.get("/mytask", async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const tasked = await taskCollection.find(query).toArray();
        res.send(tasked);
      });
      app.get("/completedTask", async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const tasked = await completeCollection.find(query).toArray();
        res.send(tasked);
      });

      app.delete("/mytask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      const querytwo = { _id: id };
      const resultwo = await taskCollection.deleteOne(query);
      res.send(result);
    });

    app.patch('/update/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: ObjectId(id) }
      const upTask = req.body.upTask
      const updateDoc = {
        $set: {
          Task: upTask
        }
      }
      const result = await taskCollection.updateOne(query, updateDoc)
      res.send(result)
    })

    app.post("/completed", async (req, res) => {
        const task = req.body;
        const result = await completeCollection.insertOne(task);
      //   const id = req.params.id;
      // const query = { _id: ObjectId(id) };
      // const results = await taskCollection.deleteOne(query);
        res.send(result);
      });


     app.delete("/complete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await completeCollection.deleteOne(query);
      res.send(result);
    });

      

  // ;;
  //  app.put('/completed/:id', async (req, res) => {
  //           const id = req.params.id;
  //           const filter = { _id: ObjectId(id) }
  //           const options = { upsert: true };
  //           const updateDoc = {
  //               $set: {
  //                   status: 'Completed'
  //               },
  //           };
  //           const result = await taskCollection.updateOne(filter, updateDoc, options)
  //           res.send(result)
  //       })

  } finally {
  }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('Server is running...')
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})