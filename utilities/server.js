const JSONTemplate = require("./JSONTemplate.js");

class Server extends JSONTemplate {
	constructor(serverID) {
		super("guilds.json");
		this.serverID = serverID;
		this.userData = this.data[serverID];
		this.text = this.userData.text;
		this.voice = this.userData.voice;	
		this.queue = [];
		this.queueNode = null;
		this.connection = null;
		this.dispatcher = null;
		this.active = false;
		this.timeout = null;
		this.ytdl = require('ytdl-core');
		this.prism = require('prism-media');
	}
	init(textID = this.text, voiceID = this.voice, connection = this.connection, guild) {
		this.text = textID;
		this.voice = voiceID;
		this.connection = connection;
		//Writing to JSON file
		this.userData.text = textID;
		this.userData.voice = voiceID;
		this.write();
		//Setting timer for leaving.
		let pointer = this;
		this.timeout = setInterval(function() {
			if(!pointer.active) {
				pointer.connection.disconnect();
				let channel = guild.channels.cache.get(textID);
				pointer.denit();
				channel.send('I left the channel because I was **inactive** for too long!');
			};
		}, 600000);
	}
	play(dispatcher) {
		this.dispatcher = dispatcher;
		this.active = true;
	}
	upChan(newChan) {
		if(!newChan) return this.voice;
		this.voice = newChan;
		this.userData.voice = newChan;
		this.write();
	} 
	denit() {
		this.text = null;
		this.voice = null;
		this.connection = null;
		//Writing to JSON file
		this.userData.text = null;
		this.userData.voice = null;
		this.write();
		//Removing the queue.
		this.queue = [];
		//Clearing interval.
		clearInterval(this.timeout);
		this.timeout = null;
	}
	queueUp(node) {
		this.queueNode = node;
	}
	clean() {
		this.queueNode = null;
	}
	async next(client) {
		if(!this.loop) this.queue.splice(0, 1);
		if(this.queue.length > 0) {
			this.active = true;
			let link = this.queue[0].link;
			let input = await this.ytdl(link, {
	            filter: "audioonly",
	            highWaterMark: 1<<25
	        });
	        const dispatcher = await this.connection.play(input);
	        dispatcher.setVolume(0.15);
	        //Updating dispatcher variable.
	        this.play(dispatcher);
	        //setting when finished function
            dispatcher.on('finish', async () => {
            	//Setting active to false.
            	this.active = false;
                this.next(client);
            });
	        //Sending message.
	        let guild = client.guilds.cache.get(this.serverID);
	        let channel = guild.channels.cache.get(this.text);
            //Sending message.
            channel.send({embed: {
                author: {
                  name: 'Now Playing'
                },
                title: this.queue[0].title,
                url: this.queue[0].link,
            }});
	    };
	}
	async remove(pos) {
		let out = this.queue[pos];
		if(!out) throw "Invalid position provided.";
		//Splicing from queue
		this.queue.splice(pos, 1);
		return out;
	}
}
module.exports = Server;
