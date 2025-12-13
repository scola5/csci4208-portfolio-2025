const mongoose = require('mongoose'); 						//import mongoose module
const Schema = mongoose.Schema 								//import the Schema class
const userSchema = new Schema({ 							//make a new instance of Schema
	email: String, 											//define collection's fields & types
	password: String
});

const User = module.exports = mongoose.model('User', userSchema); //export the schema as a module. (adding this model to mongoose under the name 'User')