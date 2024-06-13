const express = require('express');
const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://janu:1234@cluster0.3bxyt5b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

//connection to mongodb
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('!===== Connected to MongoDB =====!');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB :', err);
    });

//middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

//routes to APIs
app.use('/api/v1/customer', require('./routes/CustomerRoutesController'));
app.use('/api/v1/item', require('./routes/ItemRoutesController'));
app.use('/api/v1/order', require('./routes/OrderRoutesController'));

app.get('/', (req, res) => {
    res.send("Welcome to Janu's POS System - Server");
})

app.listen(port, () => {
    console.log(`API is running on Port ${port}`);
})


