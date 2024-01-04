const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const app = express();
const userRouter = require('./routes/userRoutes');
const agentRouter = require('./routes/agentRoutes');
const packageRouter = require('./routes/packageRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const locationRouter = require('./routes/locationRoutes');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Visit Pakistan API',
            version: '1.0.0',
            description: 'API Documentation for the Visit Pakistan app',
            contact: {
                name: "Hamza Wala Qadr",
                email: "mh.hamza01@gmail.com"
            }
        },
        servers: [
            {
                url: 'http://localhost:5000/',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const dotenv = require('dotenv').config();
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log("HTTP Method -" + req.method + " , URL - " + req.url);
    next();
});

app.use('/users', userRouter);

app.use('/agents', agentRouter);

app.use('/packages', packageRouter);
app.use('/locations', locationRouter);
app.use('/bookings', bookingRouter);



app.get('/', (req, res) => {
    res.send("hello");
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(5000, () => {
            console.log("Server has started on port 5000")
        })
    }).catch((error) => {
        console.log(error);
    })