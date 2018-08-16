const   mongoose        = require('mongoose');
let     Schema          = mongoose.Schema;

let UsersSchema = new Schema({
    "id": {
        type: String
    },
    "email": {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address.']
    },
    "firstName": {
        type: String
    },
    "lastName": {
        type: String
    },
    "phoneNumber": {
        type: Number,
        default: 0
    },
    "pictureUrl": {
        type: String
    },
    "registrationDate": {
        type: Date,
        default: Date.now()
    },
    /////////////
    "password": {
      type: String
    },
    "provider": {
      type: String
    },
    "social": {
      type: Object
    }
});

module.exports  = mongoose.model('Users', UsersSchema);
