const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7xdebar.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());



const run = async ()=> {
    try{
        const productsCollection = client.db('Ema-John').collection('Products');

        app.get('/products', async (req,res)=> {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productsCollection.estimatedDocumentCount();
            res.send({count,products});
        })

        app.post('/productsByIds', async (req,res)=> {
            const ids = req.body;
            const objectIds = ids.map(id=> new ObjectId(id))
            const query = { _id: {$in: objectIds}};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
    }
    finally{

    }
}
run().catch(err => console.log(err));





app.listen(port, ()=> {
    console.log(`listening to port ${port}`)
})