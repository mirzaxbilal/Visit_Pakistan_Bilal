const express = require('express');
const app = express();
const userRouter = require('./routes/userRoutes');
const foodRouter = require('./routes/foodRoutes');
const restaurantRouter = require('./routes/restaurantRoutes');
const mongoose = require('mongoose');

const dotenv = require('dotenv').config();
app.use(express.json());

app.use((req, res, next) => {
    console.log("HTTP Method -" + req.method + " , URL - " + req.url);
    next();
});

app.get('/', (req, res) => {
    res.send("hello");
});

app.use('/users', userRouter)
app.use('/restaurant', restaurantRouter)
app.use('/food', foodRouter)

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(5000, () => {
            console.log("server has started on port 5000")
        })
    }).catch((error) => {
        console.log(error);
    })
