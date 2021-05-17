const express = require('express')
const mongoose = require('mongoose')
const routerUser = require('./routes/routes')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
app.use(express.static('photo'))
app.use(fileUpload({}))
app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: '*',
  })
)
app.use(express.urlencoded({ extended: true }))
app.use(routerUser)

async function start() {
  try {
    await mongoose.connect('mongodb://localhost:27017/knagu', {
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    app.listen(PORT, () => {
      console.log(`Server has been started on ${PORT}...`)
    })
  } catch (e) {
    console.log(e)
  }
}
start()
