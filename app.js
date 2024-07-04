const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://Dhanush:<password>@college.e4uu3f2.mongodb.net/?retryWrites=true&w=majority&appName=College', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number
});

const Product = mongoose.model('Product', productSchema);

app.post('/products', async (req, res) => {
    const { id, name, price } = req.body;
    const product = new Product({ id, name, price });
    await product.save();
    res.status(201).send('Product created');
});

app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.get('/products/:id', async (req, res) => {
    const product = await Product.findOne({ id: req.params.id });
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

app.put('/products/:id', async (req, res) => {
    const product = await Product.findOne({ id: req.params.id });
    if (product) {
        product.name = req.body.name;
        product.price = req.body.price;
        await product.save();
        res.send('Product updated');
    } else {
        res.status(404).send('Product not found');
    }
});

app.delete('/products/:id', async (req, res) => {
    const result = await Product.deleteOne({ id: req.params.id });
    if (result.deletedCount > 0) {
        res.send('Product deleted');
    } else {
        res.status(404).send('Product not found');
    }
});

app.listen(3001, () => {
    console.log('Product catalog service running on port 3001');
});
