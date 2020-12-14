function run(guilds, Server) {
	let cache = {};
	guilds.forEach(f => {
		if(!cache[f.id]) cache[f.id] = new Server(f.id);
	});
	return cache;
}

module.exports.run = run;
