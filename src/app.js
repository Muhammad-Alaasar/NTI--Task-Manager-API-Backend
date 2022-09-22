const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const userRoutes = require('./routers/user')
const taskRoutes = require('./routers/task')
require('./db/mongoose')

app.use(express.json())
app.use(userRoutes)
app.use(taskRoutes)

app.listen(port, () => console.log(`Server online at http://localhost:${port}`))


// const jwt = require('jsonwebtoken')

// const myToken = jwt.sign({id: 123}, 'nodejs')
// console.log(myToken)
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJpYXQiOjE2NjMyODkyMzl9.Y2PrqWU3oIg3Tb7o46DHV7o6NniFf4APo5SoH445reI
// Header, Payload, Signature(Secret Key)