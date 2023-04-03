const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
require('dotenv').config();

//mongoDB
mongoose.connect("mongodb+srv://"+process.env.MONGO_DB_NAME+":" + process.env.MONGO_PW + "@cluster0.foul7vr.mongodb.net/?retryWrites=true&w=majority",
    (error) => {
        if (error == null) {
            console.log("Server is connected");
        }
        else {
            console.log(error)
            console.log("Server could not be connected");
        }
    }
);

// Lib setup
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({limit: '50mb', extended:false}))
app.use(bodyParser.json({limit: '50mb'}))

// CROS setup
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
        return res.status(200).json({})
    }
    next()
})

// Routes
const userRoutes = require('./routes/user')
app.use('/user', userRoutes)
const historicalDataRoute = require('./routes/getHisData')
app.use('/his',historicalDataRoute)
const simulationRoute = require('./routes/simulation')
app.use('/simulation',simulationRoute)

// Error detect
app.use((req,res,next)=>{
    const error = new Error("Not found");
    error.status = 404
    next(error)
})

// Error response
app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        error :{
            message : error.message
        }
    })
})

module.exports = app