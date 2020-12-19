//Requires
const Discord = require('discord.js');
const opus = require('@discordjs/opus');
const colors = require('colors');
const client = new Discord.Client();
//JSON Template Util.
let JSONTemplate = require("./utilities/JSONTemplate.js");
let Server = require("./utilities/server.js");

/*<--------------------Loading------------------------->*/
global.commands = require("./handler/commands.js")();
global.data = require("./handler/data.js")();
const setup = require("./handler/guilds.js");

client.on('ready', () => {
	//Counting guilds.
	let guilds = client.guilds;
	//Setting prefix
	client.prefix = '*';
	//Populating JSON files.
	guilds.cache.forEach((f, i) => {
		let server = new JSONTemplate("guilds.json");
		//Checking for empty files and populating them.
		if(!server.data[f.id]) server.data[f.id] = {voice: null, text: null};
		//Writing the data into the file.
		server.write();
	})
	//Getting music cache made.
	client.musicCache = setup.run(guilds.cache, Server);
	//Disconnecting bot from vc.
	guilds.cache.forEach((f, i) => {
		let server = new JSONTemplate("guilds.json");
		//Disconnecting from active voice channels.
		if(f.voice) {
			let cache = client.musicCache[f.id];
			f.voice.channel.join();
			f.voice.channel.leave();
			let channel = f.channels.cache.get(server.data[f.id].voice);
			cache.denit();
			channel.leave();
		};
	})
	//Finishing up
	console.log(`Logged in as ${client.user.tag}!`);
	console.log(`Logged in to [${guilds.cache.size}] guilds!`);
});

//When bot gets added to a new server.
client.on('guildCreate', guild => {
	let server = new JSONTemplate("guilds.json");
	//Checking for empty files and populating them.
	if(!server.data[guild.id]) server.data[guild.id] = {voice: null, text: null};
	//Writing the data into the file.
	server.write();
})

client.on('message', message => {
	//Stop DMs.
    if (message.channel.type == "dm" || message.author.bot) return;
    //Determine sender
    let userID = message.author.id;
	let serverID = message.guild.id;
	//Checking for bound channel if any.
	if(client.musicCache[serverID].text && message.channel.id != client.musicCache[serverID].text) return;
    //Making the message all lowercase.
	//Getting the message array
	let messageArray = message.content.split(" ");
    let command = messageArray[0];
	let args = messageArray.slice(1);
	//Check for prefix.
    if (!command.startsWith(client.prefix)) return;
    //Checking if user is in channel.
    if(!message.member.voice.channel) {
        message.channel.send(`**${message.author.username}**, you must be in a voice channel to use that command!`);
        return;
    };
    //Run command /item if it exists
    command = command.toLowerCase();
	let cmd = commands[command.slice(client.prefix.length)];
	if (cmd) cmd.run(client, message, args);
});

client.login(data['auth.json'].data.token);