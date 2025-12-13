//setups a HTTP POST Request to send to app's CREATE endpoint and displays result
async function testCreate(){  //called on CLICK from html
	const config = new Object();
	config.method = "POST";
	config.headers = { 'Accept': 'application/json', 'Content-Type': 'application/json'};
	config.body = JSON.stringify({'email': createEmail.value, 'password': createPassword.value}); //(vars from HTML input)
	const response = await fetch("http://localhost:3000/register", config); //(register defined in user-registers.js as endpoint for CREATE)
	const data = await response.json()
	document.body.innerHTML += `<p>${JSON.stringify(data)}</p>` //edits the HTML body with register json data
}

//Implement the HTML button's testReadAll function. Sends a fetch GET request to READ ALL endpoint.
async function testReadAll(){
	const config = new Object();
	config.method = "GET";
	const response = await fetch("http://localhost:3000/getuser", config); //waits for data
	const data = await response.json() //stores the reponse
	document.body.innerHTML += `<p>${JSON.stringify(data)}</p>` //updates HTML
}

//Implement the HTML button's testRead function. Sends a fetch GET request to the READ ONE endpoint.
async function testRead(){
	const config = new Object();
	config.method = "GET";
	const response = await fetch(`http://localhost:3000/get/${readId.value}`, config); //id will be in URL
	const data = await response.json()
	document.body.innerHTML += `<p>${JSON.stringify(data)}</p>`
}

//Implement the HTML button's testUpdate function. Sends a fetch PUT request to UPDATE endpoint.
async function testUpdate(){
	const config = new Object();
	config.method = "PUT";
	config.headers = { 'Accept': 'application/json', 'Content-Type': 'application/json'}; //you're inputting a json so you need a header
	config.body = JSON.stringify({'email': updateEmail.value, 'password': updatePassword.value}); //updated values in config.body
	const response = await fetch(`http://localhost:3000/update/${updateId.value}`, config);	//Id in URL. pass the updated config
	const data = await response.json() 
	document.body.innerHTML += `<p>${JSON.stringify(data)}</p>`
}

//Implement the HTML button's testDelete function. Sends a fetch DELETE request to DELETE endpoint
async function testDelete(){
	const config = new Object();
	config.method = "DELETE";
	const response = await fetch(`http://localhost:3000/delete/${deleteId.value}`, config);
	const data = await response.json()
	document.body.innerHTML += `<p>${JSON.stringify(data)}</p>`
}

//Implement the HTML button's testLogin function. Sends a fetch POST request to the LOGIN endpoint.
//The browser must store the token in sessionStorage/localStorage and send it back with each Request
async function testLogin(){
	const config = new Object();
	config.method = "POST";
	config.headers = { 'Accept': 'application/json', 'Content-Type': 'application/json'};
	config.body = JSON.stringify({'email': loginId.value, 'password': loginPassword.value});
	const response = await fetch("http://localhost:3000/login", config);
	const data = await response.json()
	sessionStorage.token = data.token; //client manages the  token so its stoarge in their local/session storage
	document.body.innerHTML += `<p>${JSON.stringify(data)}</p>`
}

//Implement the HTML button's testAuth function. Sends a fetch GET request to the SPECIAL endpoint.
//The browser must get the token from sessionStorage/localStorage and send it in the Request header.
async function testAuth(){
	const config = { };
	config.method = "GET";
	config.headers = {"Authorization": 'Bearer ' + sessionStorage.getItem('token')}
	const response = await fetch("http://localhost:3000/special", config);
	const data = await response.json()
	document.body.innerHTML += `<p>${JSON.stringify(data)}</p>`
}