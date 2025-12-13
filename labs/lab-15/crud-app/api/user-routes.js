const express = require ('express'); //import express module(because im user express's router)
const router = express.Router(); //create a router object
const User = require('../models/user'); //import User model(logic here affects the model there)
//---------------------------------------------------------------------------
router.post("/register", registerPOST); //POST endpoint for CREATE

async function registerPOST(request, response){ //callback fxn for endpoint
	const {email, password} = request.body; //user fields from req body(data store in body. login info in URL = bad)
	const newUser = new User({ email: email, password: password }); //create new user instance(passing login info to newUser)
	const document = await newUser.save() //schema's save() into db(new User in defined in Moogoose so it has the saved method)
	const json = {state: true, msg: "data inserted", document: document } //results as json
	response.json(json); //send json with response
}
//----------------------------------------------------------------------
router.get("/getuser", getuserGET);		//GET endpoint for READ ALL(if I get a GET request the func. is called)

async function getuserGET(request, response) {	//callback fxn for READ ALL
const documents = await User.find();	//find() gets all Users in DB -> documents
const json =  {status:200, msg:'Users data fetched', data: documents}; //results as json (your not checking if it was fetched, just assuming it was)
response.json(json);	//send json with response
}
//----------------------------------------------------
router.get("/get/:id", userGET);		//GET endpoint for READ ONE (:id = variable parameter)

async function userGET(request, response){ //callback fxn for READ ONE
const documents = await User.findById(request.params.id)	//findById() gets a User in DB (params.id == :id . unprotected against invalid input, can crash express)
	if (documents) {								//user exist then send as json
	response.status(200).json(documents);
	}
	else {											//otherwise send 404 status
	response.status(404).json({ msg: 'data not found' });
	}
}
//---------------------------------------------------------------
router.put('/update/:id', updateuserPUT);			//PUT endpoint for UPDATE

async function updateuserPUT (request,response) {	//callback fxn for UPDATE
	const user = { _id: request.params.id };			//id to find a user
	const data = { email: request.body.email, password: request.body.password } //data to update in user
	const document = await User.updateOne(user,data);	//updateOne() syncs to DB (userID to search, updatedData)
	if(!document){					//no user, 404 status
		return response.status(404).json({ msg: 'data not found' });
	}
	return response.status(200).json(document); 	////otherwise send as json
}
//----------------------------------------------------------------
router.delete('/delete/:id', deleteuserDELETE)				//DELETE endpoint for DELETE

async function deleteuserDELETE(request, response) {		//callback for DELETE
const document = await User.deleteOne({ _id: request.params.id }); //deleteOne() syncs to DB
const json = { status: 200, msg: 'User data deleted', document: document } //results as json
response.json(json);	//send json with response
}
//--------------------------------------------------------------------

const jwt = require('jsonwebtoken');		//import jsonwebtoken module

router.post('/login', loginPOST);			//POST endpoint for LOGIN

async function loginPOST(request,response) { //callback fxn for LOGIN
	const userData = request.body;					//get data from request body
	const user = await User.findOne( {email:userData.email} ).exec(); //findOne execs to DB, gets user
	if(!user){	//wrong email, send err messag
		response.status(401).json( {msg:'Invalid email'} )
	}
	else if (user.password !== userData.password){	//wrong pword, send err message
		response.status(401).json( {msg:'Invalid password'} )
	}
	else{ 
		const payload = {subject:user._id} 			//define JWT payload as user id
		const token = jwt.sign(payload,'secretKey')	//hash token = payload + secret
		response.status(200).send( {token} )		//send token back to client
	}
} 

//-------------------------------
function verifyToken( request, response, next ) {	//Middleware function
if ( !request.headers.authorization ){				//No authorization in header
	return response.status(401).json( {msg:'Unauthorized request'} ) //Send back with 401 status
}
const token = request.headers.authorization.split(' ')[1];	//split token from header bear+token
if ( token === 'null' ){	//No token
	return response.status(401).json( {msg:'Unauthorized request'} ) //Send back with 401 status
}
const payload = jwt.verify(token,'secretKey')	//Use JWT to verify Token
if ( !payload ) {								//Not valid
	return response.status(401).json( {msg:'Unauthorized request'} ) //Send back with 401 status
}
request.userId = payload.subject		//Embed user id into request
next()									//Invoke next fxn in chain
}

router.get('/special', verifyToken, specialGET)	//GET endpoint for SPECIAL

async function specialGET(request,response){	//callback fxn for SPECIAL
	const data = {user: request.userId}		//embed userID from payload into json
	response.json(data)						//send json with response
}




module.exports = router; //export router module