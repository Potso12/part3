const express = require('express')
require('dotenv').config()
const Person = require('./models/person')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))


app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(people => {
    res.json(people)
  })
  .catch(error => next(error))
})

app.get('/info', (req, res) => {
  
    const currentTime = new Date();
    Person.estimatedDocumentCount()
    .then(count => {
      res.send(`<p>Phonebook has info for ${count} people</p><p>${currentTime}</p>`)
    })
})


app.post('/api/persons', (request, response, next) => {

  console.log(request.body)

  if (!request.body.name || !request.body.number) {
    console.log("tää paska ei toimi")
    return response.status(400).json({ 
      error: 'name or number missing' 
    })  
  } 
  Person.findOne({ name: request.body.name}).then(person => {
    if(person){
      console.log("ei oo uniikki")
      return response.status(400).json({ 
        error: 'name must be unique' 
   })
    } else {
      console.log("ollaan jo tekemässä uutta henkilöö")
      const newPerson = new Person({
        name: request.body.name,
        number: request.body.number
      })
    
      newPerson.save()
      .then(savedPerson => {
        console.log('person saved')
        response.json(savedPerson)
      })
      .catch(error => next(error))
    }
  }).catch(error => next(error));
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request,response,next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {


  console.log(request.params.id)
  Person.deleteOne({_id: request.params.id})
  .then(() => console.log('delete from database success'))
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})