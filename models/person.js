const mongoose = require('mongoose')


if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}


// use environment variables to pass user credentials
const url = process.env.MONGO_DB_URI
// Connect to mongodb
mongoose.connect(url, { useNewUrlParser: true })
// Schema for persons
const personSchema = mongoose.Schema( {
  name: String,
  number: String
})
personSchema.statics.format = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person.id
  }
}
// Model for persons
const Person = mongoose.model('Person', personSchema);

module.exports = Person