// imports the Express framework into the script
const express = require('express'); 
// imports the CORS(Cross-Origin-Resource-Sharing) middleware into the script
const cors = require('cors');
// imports the Mongoose object modeling tool into the script
const mongoose = require('mongoose');
const PhoneBook = require('./model/phonebook');

require("dotenv").config();

//creates a new instance of the Express framework, which will be used to build the web server.
const app = express() 
app.use(express.json()); // parsing request body as json
app.use(cors()); //To allow cors

const PORT = 8000 // Port number
// starts the web server and listens for incoming requests on the specified port
app.listen(PORT, () => {
    console.log( `Server is running on port ${PORT}`)
});
 
//mongodb+srv://venkysss47:venky8086@phonebook.qoiav.mongodb.net/
// Mongoose connection
const db = 'mongodb+srv://venky:venky8086@phonebook.qoiav.mongodb.net/'; // connection string for the MongoDB database.
// it establishes a connection to the MongoDB database using the Mongoose object modeling tool.
// The connect() method takes two arguments:
// the connection string and an options object
mongoose.connect(db, {
    useNewUrlParser: true,//tells Mongoose to use a new and improved way of parsing the connection string to the MongoDB database.
    useUnifiedTopology: true,//tells Mongoose to use a new and improved way of handling the topology of the MongoDB database
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to database:', err.message);
});


app.post('/add-phone', async(req,res) => {
    const phoneNumber = new PhoneBook(req.body)
    try{
        await phoneNumber.save()
        res.status(201).json({
            status: 'Success',
            data : {
                phoneNumber
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})


app.get('/get-phone', async (req,res) => {
    const phoneNumbers = await PhoneBook.find({})
    try{
        res.status(200).json({
            status : 'Success',
            data : {
                phoneNumbers
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})


app.patch('/update-phone/:id', async (req,res) => {
    const updatedPhone = await PhoneBook.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
      })
    try{
        res.status(200).json({
            status : 'Success',
            data : {
              updatedPhone
            }
          })
    }catch(err){
        console.log(err)
    }
})


app.delete('/delete-phone/:id', async(req,res) => {
    await PhoneBook.findByIdAndDelete(req.params.id)
    
    try{
      res.status(204).json({
          status : 'Success',
          data : {}
      })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }
})