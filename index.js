const express = require('express')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./db')

// set up express
const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Run in port ${PORT}`)
})

// connect to mongodb
connectDB()

// set up routes
app.use('/users', require('./routes/userRouter'))
app.use('/todos/', require('./routes/todoRouter'))
