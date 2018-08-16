const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

let SchemaPicture = new Schema({
    "createdDate": {
        type: Number,
        default: Date.now()
    },
    "url": {
        type: String
    },
    "description": {
        type: String
    },
    "mentions": {
        type: [String]
    },
    "tags": {
        type: [String]
    },
    "userId": {
        type: String
    }
});

SchemaPicture.virtual('id').get(function(){
    return this._id.toHexString();
});

SchemaPicture.set('toJSON', {
    virtuals: true
});


module.exports  = mongoose.model('Pictures', SchemaPicture);
