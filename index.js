
const express = require('express')
const app = express()

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
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

app.get('/info', (request, response) => {
    const timestamp =new Date().toString()
    response.send(`<div><p>puhelinluettelossa ${persons.length} henkilön tiedot</p><p>${timestamp}</p></div>`)
})

    
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})