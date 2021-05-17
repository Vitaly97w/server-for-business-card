const { ObjectId } = require('bson')
const { Schema, model } = require('mongoose')

const schema = new Schema({
  idUser: ObjectId,
  H2: String,
  cards: Array,
})

module.exports = model('usersPortfolioCards', schema)
