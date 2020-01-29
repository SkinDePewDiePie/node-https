var fs = require("fs");
var config = require("./config.json");

module.exports ={
	stateFiles: function(){
		var failed = 0;

		fs.stat(`${config.html_dir}`, (error) =>{
			if(!error) var failed = 0;
			if(error) return fs.mkdir(`${config.html_dir}`, (error) =>{
				if(!error) var failed = 0;
				if(error){
					var failed = 1;
					return new Error(error);
				}
			});
		});

		fs.stat(`${config.modules_dir}`, (error) =>{
			if(!error) var failed = 0;
			if(error) return fs.mkdir(`${config.modules_dir}`, (error) =>{
				if(!error) var failed = 0;
				if(error){
					var failed = 1;
					return new Error(error);
				}
			});
		});

		fs.stat(`${config.html_dir}/index.html`, (error) =>{
			if(!error) var failed = 0;
			if(error) return fs.writeFile(`${config.html_dir}/index.html`, "Your website working ! <a href=\"https://skindepewdiepie.github.io\">Created by Node HTTPS by SkinDePewDiePie_</a>", (error) =>{
				if(!error) var failed = 0;
				if(error){
					var failed = 1;
					return new Error(error);
				}
			});
		});

		if(failed === 0) return true;
		if(failed === 1) return false;
	}
};