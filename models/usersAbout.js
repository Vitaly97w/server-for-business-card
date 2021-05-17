const { ObjectId } = require('bson')
const { Schema, model } = require('mongoose')

const schema = new Schema({
  idUser: ObjectId,
  aboutText: String,
})

module.exports = model('usersAbout', schema)
