
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
const Person = mongoose.model('Person', personSchema)

// proper amount of arguments given
if(process.argv.length === 4) {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person.save()
    .then(result => {
      console.log(`lisätään henkilö ${result.name} numero ${result.number} luetteloon`)
      mongoose.connection.close()
    })

}else if(process.argv.length === 2 ) {
  // No arguments
  Person
    .find({})
    .then(result => {
      console.log('puhelinluettelo:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}else {
  // Error. Operation not specified. Printing usage
  console.error('Invalid amount of arguments.Usage:\nnode mongo.js NAME NUMBER\tAdds number\nnode mongo.js\t\t\tLists data')
  mongoose.connection.close()
}
