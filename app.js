var express = require("express");
var morgan = require("morgan");
var favicon = require("serve-favicon");
var https = require("https");
var fs = require("fs");
var functions = require("./functions.js");
var config = require("./config.json");

var app = express();

if(config.modules.includes("php")){
	var phpModule = require(`${config.modules_dir}/php/module.js`)();

	app.use("*.php", (request, response, next) =>{
		phpModule.parseFile(request.originalUrl.replace("/", ""), (phpResult) =>{
			response.write(phpResult);
			response.end();
		});
	});
}

app.use(morgan("combined")).use(express.static(`${config.html_dir}`)).use((request, response, next) =>{
	response.status(404).send(`Sorry, i can't find ${request.originalUrl} ! Check the URL.`);
}).use((error, request, response, next) =>{
	response.status(500).send("An error has been occured ! Try again later.");
	throw new Error(error);
});
 
app.get("/", (request, response) =>{
	if(functions.stateFiles() === false) response.send("<script>window.onload = function(){ window.location.reload(); }</script>");
	response.send(fs.readFileSync(`${config.html_dir}/index.html`).toString());
}).get(":page", (request, response) =>{
	if(functions.stateFiles() === false) response.send("<script>window.onload = function(){ window.location.reload(); }</script>");
	response.send(fs.readFileSync(`${config.html_dir}/${request.params.page}`).toString());
});

if(config.use_only_http !== "false" && config.use_only_http !== "true") throw new Error("Please define true or false for the variable use_only_http on the file config.json. The program cannot continue.");
if(config.use_only_ssl !== "false" && config.use_only_ssl !== "true") throw new Error("Please define true or false for the variable use_only_ssl on the file config.json. The program cannot continue.");
if(config.use_only_http === "false" && config.use_only_ssl === "false") throw new Error("Please define true for use_only_http or for the variable use_only_ssl on the file config.json. The program cannot continue.");

if(config.use_only_ssl === "true"){
	https.createServer({
		key: fs.readFileSync(config.ssl_key),
		cert: fs.readFileSync(config.ssl_cert),
		passphrase: config.ssl_pass
	}, app).listen(config.ssl_port);

	console.log(`Node HTTP running on port ${config.ssl_port} !`);
}

if(config.use_only_http === "true"){
	app.listen(config.http_port);

	console.log(`Node HTTP running on port ${config.http_port} !`);
}