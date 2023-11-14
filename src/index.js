const express = require('express');
const app = express();
const userRouter = require('./routes/userRoutes');
const agentRouter = require('./routes/agentRoutes');
const packageRouter = require('./routes/packageRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv').config();
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log("HTTP Method -" + req.method + " , URL - " + req.url);
    next();
});

app.use('/users', userRouter)

app.use('/agents', agentRouter)

app.use('/packages', packageRouter)

app.use('/bookings', bookingRouter)

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

