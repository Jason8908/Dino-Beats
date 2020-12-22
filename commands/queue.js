module.exports.run = async (client, message, args) => {
    //ID's
    const userID = message.author.id;
    const serverID = message.guild.id;
    const serverName = message.guild.name;
    //Requires.
    //Utils.
    let Queue = require('../utilities/utils.js').queue;
    //Checking if any songs are playing.
    let cache = client.musicCache[serverID];
    let queue = cache.queue;
    if(queue.length < 1) {
        message.channel.send({embed: {
            color: 0xff0000,
            description: `**Nothing is currently playing.**`
        }});
        return;
    };
    //Resetting node.
    if(cache.queueNode) cache.queueNode.destroy();
    //Making node.
    cache.queueUp(new Queue(queue, client));
    //Making message.
    let songs = `__Now Playing__\n **${queue[0].title}** | ` + "`" + `${queue[0].length} Requested by: ${queue[0].requestBy}.` + "`" + '\n\n';
    songs = cache.queueNode.messageMake(songs, 1);
    let page = cache.queueNode.page, total = cache.queueNode.total;
    //Sending message.
    let msg = await message.channel.send({embed: {
        color: 0x3090B4,
        title: `${serverName} Music Queue`,
        fields: [
            {
                name: "Songs:",
                value: `${songs}`
            }
        ],
        footer: {
          icon_url: `${message.author.displayAvatarURL()}`,
          text: `Page ${page}/${total}`
        },
    }}).then(out => {
        out.react('⬆️');
        out.react('⬇️');
        //Init Queue.
        cache.queueNode.init(out, serverID, serverName);
    })
};

module.exports.help = {
    name: ['queue', 'q'],
    description: "View the queue.",
    page: 1,
    title: "Music Commands"
};