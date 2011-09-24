/*
Sample usage:

var db = require('db');

// create user
var user = new db.User();
user.save(function callback(err) {});

// find all users
db.Users.find();

*/

var mongoose = require('mongoose')
	, Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/mongochat');

/*
Set-up schema
*/

var UserSchema = new Schema({
    nick     : { type: String, index: true, unique: true }
  , date      : { type: Date , 'default': function() {
			return new Date();
		}}
});

var MessageSchema = new Schema({
    msg     : { type: String }
  , user_id      : { type: Number }
});

mongoose.model('User', UserSchema);
mongoose.model('Message', MessageSchema);

/*
	Make database models publicly accessible
*/

var db = {
	User: mongoose.model('User'),
	Message: mongoose.model('Message')	
};

module.exports = db;