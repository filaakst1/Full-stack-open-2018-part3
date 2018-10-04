
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    },
    {
        name: 'Martti Tienari',
        number: '040-123456',
        id: 2
    },
    {
        name: 'Arto Järvinen',
        number: '040-123456',
        id: 3
    },
    {
        name: 'Lea Kutvonen',
        number: '040-123456',
        id: 4
    }
  ]


const generateId = () => {
    let id = randomNumber(); 
    while( persons.find(person=> person.id === id ) ) {
        // In case random number is reserved, pick another one
        id =randomNumber()
    }
    return id;
}
const randomNumber= ()=> {
    return Math.floor(Math.random() * 1E6)+1; 
}

app.get('/api/persons', (request, response) => {
    console.log('requested all data')
    response.json(persons)
})
app.post('/api/persons', (request, response) => {
    console.log('Data posted to server')
    const body = request.body

    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
    persons = persons.concat(person)
    response.json(person)
  })
  
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(`requested person with id=${id}`)
    const person = persons.find(person => person.id === id)
    if(person) {
        console.log(`found ${person}`)
        response.json(person)
    }else {
        console.log(`person ${id} not found`)
        response.status(404).end()
    }
    
    
    
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(`delete requested for person with id=${id}`)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  
app.get('/info', (request, response) => {
    const timestamp =new Date().toString()
    response.send(`<div><p>puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${timestamp}</p></div>`)
})

    
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})