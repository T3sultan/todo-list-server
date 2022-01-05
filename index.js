const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mydbuser1:U4aBqsAbJVF4a7up@cluster0.dgqch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//mydbuser1
//U4aBqsAbJVF4a7up


async function run() {
      try {
            await client.connect();
            const database = client.db('foodMaster')
            const usersCollection = database.collection('users');

            //GET API
            app.get('/users', async (req, res) => {
                  const cursor = usersCollection.find({});
                  const users = await cursor.toArray();
                  res.send(users)

            })

            app.get('/users/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: ObjectId(id) };
                  const user = await usersCollection.findOne(query);

                  //  console.log('load user with id:', id);
                  res.send(user);
            })



            //POST API
            app.post('/users', async (req, res) => {
                  const newUser = req.body;
                  const result = await usersCollection.insertOne(newUser);


                  console.log('Got new user', req.body)
                  console.log('added user', result)
                  // res.send('hit the post')
                  res.json(result)
            })
            //UPDATE API
            app.put('/users/:id', async (req, res) => {
                  const id = req.params.id;
                  const updatedUser = req.body;
                  const filter = { _id: ObjectId(id) };
                  const options = { upsert: true };
                  const updateDoc = {
                        $set: {
                              name: updatedUser.name,
                              email: updatedUser.email
                        },
                  };
                  const result = await usersCollection.updateOne(filter, updateDoc, options)
                  console.log('updating', id)
                  res.json(result)
            })

            //DELETE API
            app.delete('/users/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: ObjectId(id) }
                  const result = await usersCollection.deleteOne(query)
                  console.log('deleting user id', result);
                  res.json(result);
            })
            //userInfo
            app.post("/addUserInfo", async (req, res) => {
                  console.log("req.body");
                  const result = await usersCollection.insertOne(req.body);
                  res.send(result);
                  console.log(result);
            });



      }
      finally {
            // await client.close();
      }

}

run().catch(console.dir)


app.get('/', (req, res) => {
      res.send("Running my CRUD Server");
});
app.listen(port, () => {
      console.log('Running Server on port', port);
});