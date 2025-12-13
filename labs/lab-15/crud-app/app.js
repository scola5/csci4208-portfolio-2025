//set up 
	//db connection
	const express = require ('express');									//import express module
	const app = express();													//create express app
	const port = 3000;														//define server port

	const { database } = require ('./config/database');						//import db config settings(the database URL, in database.js)
	const mongoose = require ('mongoose');									//import mongoose(Mango client)

	//const mongoose_config = {useNewUrlParser: true, useUnifiedTopology: true}; //connection configs. I was getting an error and google says that these are set as default now
	const connection = mongoose.connect(database/*, mongoose_config*/);			//connect to mongo server(you're passing the URL and config settings)

	if (connection){													//logs connection result
		console.log('database connected');
	}
	else{
		console.log('database connection error')
	}

	//importing body parser and connecting our route directory
	const bodyParser = require('body-parser'); //import body-parser module
	const userRoutes = require('./api/user-routes'); //import user-routes module
	
	app.use(bodyParser.json()); //use body-parser for json
	app.use('/', userRoutes); //use router on root path (listen on root directory for the endpoints )
//-------------------

app.use( express.static('public') );									//use public/ for static files
app.get("/", getIndex);													//GET endpoint for index.html

app.listen(port, () => console.log("server is running port ", port) ); //app listens for request

function getIndex(request, response){									//callback fxn for request. in response to GET requests 
response.sendFile('./public/index.html', { root: __dirname });			//sends index.html file
}