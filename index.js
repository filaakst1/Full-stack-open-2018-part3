
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('build'))


morgan.token('content', function (req) {
  return JSON.stringify(req.body)
})

// Enable logging for requests
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))
// Enable cors
app.use(cors())
app.use(bodyParser.json())

// Get request that return all persons
app.get('/api/persons', (request, response) => {
  console.log('requested all data')
  Person.find({})
    .then(people => {
      response.json(people.map(Person.format))
    }).catch(exc => {
      console.error(exc)
      response.status(400).json({ error: exc })
    })
})

// Put request for update
app.put('/api/persons/:id', (request, response) => {
  console.log('Put request posted to server')
  const body = request.body

  if(!body) {
    return response.status(400).json({ error: 'request body missing' })
  }

  const person = {
    name: body.name,
    number: body.number
  }

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name is missing' })
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: 'number is missing' })
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.error(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

// Post request for new users
app.post('/api/persons', (request, response) => {
  console.log('Data posted to server')
  const body = request.body
  if(!body) {
    return response.status(400).json({ error: 'request body missing' })
  }

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name is missing' })
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: 'number is missing' })
  }

  Person.find({ name: body.name })
    .then(person => {
      if(person.length !== 0) {
        return response.status(400).json({ error: 'name must be unique' })
      }
      else {
        const person = new Person({
          name: body.name,
          number: body.number
        })

        person.save()
          .then(result => {
            response.json(Person.format(result))})}
    }).catch(exc => {
      console.error(exc)
      response.status(400).json({ error: exc })
    })
})

// Get request for single user
app.get('/api/persons/:id', (request, response) => {
  console.log(`requested person with id=${request.params.id}`)
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        console.log(`found ${person}`)
        response.json(Person.format(person))
      }
      else {
        console.log(`person ${request.params.id} not found`)
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

// Delete request
app.delete('/api/persons/:id', (request, response) => {
  console.log(`delete requested for person with id=${request.params.id}`)
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(`Delete returned ${result}`)
      response.status(204).end()
    })
    .catch(error => {
      console.error(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

// Request for database info
app.get('/info', (request, response) => {
  Person.count({})
    .then(value => {
      const timestamp =new Date().toString()
      console.log(`Database size is ${value}`)
      response.send(`<div><p>puhelinluettelossa ${value} henkilön tiedot</p><p>${timestamp}</p></div>`)
    })
})

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})