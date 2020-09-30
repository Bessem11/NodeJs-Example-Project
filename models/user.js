var passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    admin:   {
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User',UserSchema);

module.exports=User;

