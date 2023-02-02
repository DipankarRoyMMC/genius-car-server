const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

// middlewares 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tmkhisl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const serviceCollction = client.db('geniusCar').collection('services');
    const orderCollection = client.db('geniusCar').collection('orders');
    try {
        // get data from database display client side find multiple method
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollction.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // single data find one server 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await serviceCollction.findOne(query);
            res.send(services);
        })

        // orders api 
        app.get('/orders', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email,
                }
            }

            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });

        // patch api 
        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: status
                }
            }
            const result = await orderCollection.updateOne(query, updateDoc);
            res.send(result);
        })


        // Delete order item 
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(err => console.log(err));



app.get('/', (req, res) => {
    res.send('<h1>Node Server in Running</h1>');
})

app.listen(port, () => {
    console.log(`Servier is Running ${port}`);
});