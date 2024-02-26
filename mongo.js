const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =`mongodb+srv://fullstack:${password}@fullstackphonebook.blytkvo.mongodb.net/?retryWrites=true&w=majority&appName=fullstackPhonebook`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const PhoneNumber = mongoose.model('phoneNumber', phoneSchema)

if(process.argv.length === 3) {
  PhoneNumber.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
  return
}
else if(process.argv.length == 5) {

const phoneN = new PhoneNumber({
  name: process.argv[3],
  number: process.argv[4]
})


phoneN.save().then(result => {
  console.log(`added ${result.name} number ${result.number} to phonebook`)
  console.log(process.argv.length)
  mongoose.connection.close()

})
}
