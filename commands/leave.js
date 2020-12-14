module.exports.run = async (client, message, args) => {
    //Extract variables
    let serverID = message.guild.id;
    let userID = message.author.id;
    //Checking if user is in channel.
    if(!message.member.voice.channel) {
        message.channel.send(`**${message.author.username}**, you must be in a voice channel to use that command!`);
        return;
    };
    let server = client.musicCache[serverID];
    //Trying to join the voice channel.
    if(!server.voice) {
        message.channel.send(`**${message.author.username}**, I am not in a voice channel!`);
        return;
    };
    let channel = message.guild.channels.cache.get(server.voice);
    server.denit();
    channel.leave();
    message.channel.send(`**${message.author.username}**. Goodbye! Thanks for listening!`);
}
module.exports.help = {
    name: ["leave"],
    description: "Leave the call!",
    page: 1,
    title: "Music Commands"
};
  