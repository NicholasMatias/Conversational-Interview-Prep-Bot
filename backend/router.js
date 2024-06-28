const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()





app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000
console.log('Port:', PORT)




const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})