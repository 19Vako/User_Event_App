const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./route/index.js'); 
const env = process.env
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors())
app.use('/api', router);

mongoose.connect(env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
   .then(() => {
       console.log('Connected to MongoDB');
       app.listen(env.PORT, () => {
         console.log(`Server is running on port ${env.PORT}`);
       })
   })
   .catch(err => {
       console.error('Error connecting to MongoDB:', err);
       process.exit(1);
   })
