
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('build'))



morgan.token('content', function (req, res) { return JSON.stringify(req.body) })

// Enable logging for requests
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))
// Enable cors 
app.use(cors())
app.use(bodyParser.json())

// Get request that return all persons 
app.get('/api/persons', (request, response) => {
    console.log('requested all data')
    Person.find({})
        .then(people=> {
            response.json(people.map(Person.format))
        })
})
// Post request for new users
app.post('/api/persons', (request, response) => {
    console.log('Data posted to server')
    const body = request.body
    if(!body) {
        return response.status(400).json({error: 'request body missing'})
    }
    console.log(JSON.stringify(body))
    if (body.name === undefined) {
      return response.status(400).json({error: 'name is missing'})
    }
    if (body.number === undefined) {
        return response.status(400).json({error: 'number is missing'})
    }
    Person.find({ name: body.name })
        .then(person => {
            if(person.length !== 0) {
                return response.status(400).json({error: 'name must be unique'})
            }else {
                const person = new Person({
                    name: body.name,
                    number: body.number
                })
                person.save().then(result => {
                    response.json(Person.format(result))
                })
            }
        }).catch(exc=>{
            console.error(exc)
            response.status(400).json({error: exc})
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
            }else {
                console.log(`person ${id} not found`)
                response.status(404).end()
            }
    
        }).catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
        })
})
// Delete request
app.delete('/api/persons/:id', (request, response) => {
    console.log(`delete requested for person with id=${request.params.id}`)
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            console.error(error)
            response.status(400).send({ error: 'malformatted id' })
        })
  })
 // Request for database info 
app.get('/info', (request, response) => {
    const timestamp =new Date().toString()
    Person.find({})
    .then(people=> {
        response.send(`<div><p>puhelinluettelossa ${people.length} henkilön tiedot</p><p>${timestamp}</p></div>`)
    })
})

    
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})