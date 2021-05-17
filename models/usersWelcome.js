const { ObjectId } = require('bson')
const { Schema, model } = require('mongoose')

const schema = new Schema({
  idUser: ObjectId,
  welcomeText: String,
})

module.exports = model('usersWelcome', schema)
