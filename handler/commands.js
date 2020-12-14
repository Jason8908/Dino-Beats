function run() {
	//Requires
	const readdirSync = require('fs').readdirSync;
	const resolve = require('path').resolve;
	//Read files from path
    let path = resolve("./commands");
	let files = readdirSync(path).filter(f => f.split(".").pop() === "js");
	let loadStr = '[Commands]';
	let commands = {};
	let help = []
	if(!commands.helpPage) commands.helpPage = help;
	else help = commands.helpPage;
	//Print to console
	if(files.length <= 0) console.log(`${loadStr.green.bold} No commands to load.\n`);
	else {
		console.log(`${loadStr.green.bold} ${files.length} commands detected.`);
		files.forEach((f, i) => {
			//Get the fp and the function
			let fp = `${path}/${f}`;
			let props = require(fp);
			let loaded = `${f.toString()} loaded!`;
			console.log(`${loadStr.green.bold} [${i+1}] ${loaded.yellow}`);
			
			//Make a map of it with the name as the key
			for (let i=0; i<props.help.name.length; i++) {
				let name = props.help.name[i];
				commands[name] = props;
			}
			
			//Add the item to commands.help
			//Checking if the page exists in the array; if not, create it.
			let page = props.help.page-1;
			if (!help[page]) {
				help[page] = {};
				help[page].name = props.help.title;
				help[page].value = ``;
			}
			//If it already exists, just add it to the page.
			help[page].value += `\`${props.help.name}\`: ${props.help.description} \n`;
		});
		console.log(`${loadStr.green.bold} All commands have been loaded!\n`);
	}
	return commands;
}

module.exports = run;
