const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.mongoDB_URL).then(()=>{
    console.log('DB is connected')
})
.catch(()=>{
    console.log('Error in connection!!!')
})