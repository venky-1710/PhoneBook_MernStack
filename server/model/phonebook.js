const mongoose = require('mongoose');
const PhoneBookSchema = new mongoose.Schema({
    name : {
        type : String,  
        required: true
    },
    phoneNumber : {
        type : Number , 
        //unique : true ,  
        required : true
    }
});

const PhoneBook = mongoose.model('PhoneBook',PhoneBookSchema);
module.exports=PhoneBook;