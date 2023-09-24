const express = require('express');
const app = express();
const userRouter = require('./routes/userRoutes');
const mongoose = require('mongoose');

const dotenv = require('dotenv').config();

app.use(express.json());

app.use((req, res, next) => {
    console.log("HTTP Method -" + req.method + " , URL - " + req.url);
    next();
});

app.use('/users', userRouter)



app.get('/', (req, res) => {
    res.send("hello");
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(5000, () => {
            console.log("server has started on port 5000")
        })
    }).catch((error) => {
        console.log(error);
    })

