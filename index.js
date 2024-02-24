const express = require('express')
const morgan = require('morgan') 
const app = express()
const cors = require('cors')

app.use(cors())


// Custom format for morgan
morgan.token('postData', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
app.use(express.json())

let phoneBook = [
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

app.get('/', (request, response) => {
  console.log('Hello from root')
})



app.get('/info', (request, response) => {
  let infoPhoneBook = `<p>Phonebook has info for ${phoneBook.length} people</p> ${new Date()}`;
  response.send(infoPhoneBook)
})

app.get('/api/persons', (request, response) => {
  response.json(phoneBook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = phoneBook.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phoneBook = phoneBook.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
   const newId = Math.floor(Math.random() *9999999)
   return newId
}
const handleError = ({body}) =>
{
  if (!body.name){
    return 'name missing'
  }
  if (!body.number){
    return 'number missing'
  }
  if (phoneBook.find(person => person.name === body.name)){
    return 'name must be unique'
  }
  return null
}
app.post('/api/persons', (request, response) => {
  const body = request.body
  const error = handleError({body})
  if (error !== null ){
    return response.status(400).json({error}) //Bad request
  }
  const phone = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  phoneBook = phoneBook.concat(phone)
  response.json(phone)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})