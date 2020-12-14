module.exports.run = async (client, message, args) => {
    const userID = message.author.id;
    const serverID = message.guild.id;

    let queue = client.musicCache[serverID].queue;

    if(queue.length < 1) {
        message.channel.send({embed: {
            color: 0xff0000,
            description: `**Nothing is currently playing.**`
        }});
        return;
    };

    let songs = `__Now Playing__\n **${queue[0].title}** | ` + "`" + `${queue[0].length} Requested by: ${queue[0].requestBy}.` + "`" + '\n\n';

    songs += '__Current Queue__\n'
    if(queue.length > 1) {
        for(let i = 1; i < queue.length; i++ ) {
            songs += `${[i]}. **${queue[i].title}** | ` + "`" + `${queue[i].length} Requested by: ${queue[i].requestBy}.` + "`" + '\n';
        };
    };

    message.channel.send({embed: {
        color: 3447003,
        title: `Server Music Queue`,
        fields: [
            {
                name: "Songs:",
                value: `${songs}`
            }
        ]
    }});
};

module.exports.help = {
    name: ['queue', 'q'],
    description: "View the queue.",
    page: 1,
    title: "Music Commands"
};