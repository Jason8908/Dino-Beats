module.exports.run = async (client, message, args) => {
    const userID = message.author.id;
    const serverID = message.guild.id;
    //Getting the number to remove.
    let id = args[0];
    //Checking for queue.
    if(!client.musicCache[serverID].queue.length) {
        message.channel.send({embed: {
            color: 0xff0000,
            description: `**Nothing is currently playing.**`
        }});
        return;
    };
    //Trying to remove the song.
    client.musicCache[serverID].dispatcher.emit('finish');
    //Sending the message.
    message.channel.send({embed: {
        description: `**The song was successfully skipped!**`
    }});
};

module.exports.help = {
    name: ['skip'],
    description: "Skip the current song!",
    page: 1,
    title: "Music Commands"
};