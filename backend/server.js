require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const rulesRoutes = require('./routes/rules'); 
const metricRoutes = require('./routes/metrics'); 
const notificationRoutes = require('./routes/notifications');
const { evaluateRules } = require('./services/alertEngine');
const webhooksRoutes = require('./routes/webhooks');
const fetchWeatherData  = require('./services/fetchMetricService');



const app = express()
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
  })

app.use('/api/v1/rules', rulesRoutes);
app.use('/api/v1/metrics', metricRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/webhooks', webhooksRoutes);


setInterval(() => {
  fetchWeatherData();
    evaluateRules();
  }, process.env.EVALUATION_INTERVAL || 60000);
  

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Connected to database")
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    })

