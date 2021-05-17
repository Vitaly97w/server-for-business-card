const { ObjectId } = require('bson')
const { Schema, model } = require('mongoose')

const schema = new Schema({
  idUser: ObjectId,
  contnacts: Array,
})

module.exports = model('userContact', schema)
