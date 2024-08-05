const express = require('express')
const app = new express()
const morgan = require('morgan')
const cors = require('cors')
app.use(morgan('dev'))
require('dotenv').config()
require('./db/dbConnect')

app.use(morgan('dev'))
app.use(cors({
  origin: 'https://arjunictak.vercel.app', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const princyRoutes = require('./routes/princyRoutes')
const salmanRoutes2 = require('./routes/salmanRoutes2')
const fathimaRoutes = require('./routes/fathimaRoutes')
const arjunRoutes = require('./routes/arjunRoutes')
const discussionRoutes = require('./routes/discussion'); // Import discussion routes




app.use('/api/princy',princyRoutes)
app.use('/api/salman',salmanRoutes2)
app.use('/api/fathima',fathimaRoutes)
app.use('/api/arjun',arjunRoutes)
app.use('/api/discussion', discussionRoutes)



app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on PORT ${process.env.PORT}:`)
})