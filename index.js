const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()
const cors = require('cors')


const PhoneNumber = require('./models/phoneNumber')


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

  PhoneNumber.find({}).then(result => {

    let infoPhoneBook = `<p>Phonebook has info for ${result.length} people</p> ${new Date()}`;
    response.send(infoPhoneBook)
  })
    .catch(error => next(error))

})

app.get('/api/persons', (request, response) => {
  PhoneNumber.find({}).then(result => {
    response.json(result)
  })
})


app.get('/api/persons/:id', (request, response, next) => {
  PhoneNumber.findById(request.params.id).then(phone => {
    if (phone) {
      response.json(phone)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      next(error)
    })
})


app.delete('/api/persons/:id', (request, response) => {
  PhoneNumber.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  }
  )
    .catch(error => next(error))

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

app.post('/api/persons', (request, response,next) => {
  console.log('request.body', request.body)
  const body = request.body

 
  const phone = new PhoneNumber({
    name: body.name,
    number: body.number
  })
  phone.save().then(savedPhone => {
    response.json(savedPhone)
  })
  .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const phoneToUpdate = {
    name: body.name,
    number: body.number
  }

  PhoneNumber.findByIdAndUpdate(request.params.id, phoneToUpdate, { new: true, runValidators: true, context: 'query'})
    .then(updatedPhone =>
      response.json(updatedPhone))
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
 
  next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
