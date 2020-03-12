const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config();
process.log = {}
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const {
    MONGODB_URI
} = require('./mongoConfig')
const indexRoutes = require('./routes')

app.use(cors())
app.use(morgan("tiny"))

app.use(bodyParser.json())
app.use(express.json());
app.use('./uploads', express.static('uploads'))

app.use('/api', indexRoutes);

// root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        data: 'Welcome to Desa Sehat api'
    })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// fireup the server
mongoose.connect(MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log(`Successfull connected to database Desa Sehat app`)
    })
    .catch(() => {
        process.exit()
    });
mongoose.set('useFindAndModify', false)

module.exports = app;