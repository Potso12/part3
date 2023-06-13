const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

app.get('/info', (req, res) => {
    const currentTime = new Date();
    const lenght = phonebook.length;
    res.send(`<p>Phonebook has info for ${lenght} people</p><p>${currentTime}</p>`)
})


app.post('/api/persons', (request, response) => {
    const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  } if(phonebook.find(person => person.name === name)){
    return response.status(400).json({ 
         error: 'name must be unique' 
    })
  }


  const min = 10;
  const max = 1000;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  const newPerson = {
    id: randomNumber,
    name: name,
    number: number
  }

  phonebook = phonebook.concat(newPerson)

  response.json(newPerson)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = phonebook.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})