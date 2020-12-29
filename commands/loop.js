module.exports.run = async (client, message, args) => {
    //Extract variables
    let serverID = message.guild.id;
    let userID = message.author.id;
    //Checking if user is in channel.
    if(!message.member.voice.channel) {
        message.channel.send(`**${message.author.username}**, you must be in a voice channel to use that command!`);
        return;
    };
    //Getting queue.
    let cache = client.musicCache[serverID];
    let queue = cache.queue;
    //Messaging if nothing is playing.
    if(queue.length < 1) {
        message.channel.send({embed: {
            color: 0xff0000,
            description: `**Nothing is currently playing.**`
        }});
        return;
    };
    if(cache.loop) {
        cache.loop = false;
        message.channel.send(`⏯️ Looping **Disabled**`);
    }
    else {
        cache.loop = true;
        message.channel.send(`⏯️ Looping **Enabled**`);
    };
}
module.exports.help = {
    name: ["loop"],
    description: "Loop the current song!",
    page: 1,
    title: "Music Commands"
};
  