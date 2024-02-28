const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()
const cors = require('cors')


const PhoneNumber = require('./models/phoneNumber')
const phoneNumber = require('./models/phoneNumber')

app.use(cors())
app.use(express.static('dist'))


// Custom format for morgan
morgan.token('postData', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
app.use(express.json())


app.get('/info', (request, response) => {
  let infoPhoneBook = `<p>Phonebook has info for ${phoneBook.length} people</p> ${new Date()}`;
  response.send(infoPhoneBook)
})

app.get('/api/persons', (request, response) => {
  PhoneNumber.find({}).then(result => {
    response.json(result)
  })
})


app.get('/api/persons/:id', (request, response) => {
  PhoneNumber.findById(request.params.id).then(phone => {
    if (phone) {
      response.json(phone)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    response.status(500).end()
  })
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phoneBook = phoneBook.filter(person => person.id !== id)
  response.status(204).end()
})



const handleError = ({ body }) => {
  if (!body.name) {
    return 'name missing'
  }
  if (!body.number) {
    return 'number missing'
  }

  return null
}

app.post('/api/persons', (request, response) => {
  console.log('request.body', request.body)
  const body = request.body
  const error = handleError({ body })
  if (error !== null) {
    return response.status(400).json({ error }) //Bad request
  }
  const phone = new PhoneNumber({
    name: body.name,
    number: body.number
  })
  phone.save().then(savedPhone => {
    response.json(savedPhone)
  })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on puerto: ${PORT}`)
})
