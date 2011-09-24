
require.paths.unshift(__dirname + '/../../lib/');

/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/mongochat');

/**
 * Schema definition
 */

var UserSchema = new Schema({
    nick     : { type: String, index: true }
  , date      : { type: Date , 'default': function() {
			return new Date();
		}}
});

/**
 * Pre hook.
 */

UserSchema.pre('save', function(next, done){
  //emailAuthor(done); // some async function
	console.log('about to save User');
  next();
});

/**
 * Define model.
 */

//mongoose.model('User', User);

// retrieve my model
var User = mongoose.model('User', UserSchema);

// create a blog post
var bob = new User({nick: 'Bob'});

// create a comment
//post.comments.push({ title: 'My comment' });

bob.save(function (err) {
  if (!err) { 
		console.log('Success!');
		

		
	}
});
