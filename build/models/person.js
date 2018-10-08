const mongoose = require('mongoose')


// use environment variables to pass user credentials
const MONGO_DB_USER= process.env.MONGO_DB_USER
const MONGO_DB_PASSWORD=process.env.MONGO_DB_PASSWORD
const url = `mongodb://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@ds125273.mlab.com:25273/fso2018`
// Connect to mongodb
mongoose.connect(url, { useNewUrlParser: true })
// Schema for persons
const personSchema = mongoose.Schema( {
  name: String,
  number: String
})
// Model for persons
const Person = mongoose.model('Person', personSchema);

module.exports = Person