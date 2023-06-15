const mongoose = require('mongoose')
const password = process.argv[2]

const url =
  `mongodb+srv://otsotikkanen:${password}@cluster0.icfpaih.mongodb.net/phonebook`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
id: Number,
name: String,
number: String
})

const Person = mongoose.model('Person', personSchema)



if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
} if(process.argv.length == 4) {
  console.log('wrong amount of parameters')
} if(process.argv.length == 3){
    console.log('it does not work')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
    
} if(process.argv.length == 5){
    const name = process.argv[3]

    const number = process.argv[4]

    const person = new Person({
    id: Math.floor(Math.random() * (1001)),
    name: name,
    number: number,
    })

    person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
})
}

