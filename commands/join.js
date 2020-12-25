module.exports.run = async (client, message, args, callback = null) => {
    //Extract variables
    let serverID = message.guild.id;
    let userID = message.author.id;
    let end;
    //Checking if user is in channel.
    if(!message.member.voice.channel) {
        message.channel.send(`**${message.author.username}**, you must be in a voice channel to call me!`);
        end = -1;
        if(callback) callback(end);
        return end;
    };
    // Get the client's voiceConnection
    let clientVoiceConnection = message.guild.voice;
    if(clientVoiceConnection) {
            message.channel.send(`**${message.author.username}**, I'm already in a channel!`);
            end = -1;
            if(callback) callback(end);
            return end;
    };
    //Channel IDs
    let textID = message.channel.id;
    let voiceID = message.member.voice.channel.id;
    let textChannel = message.channel;
    let voiceChannel = message.member.voice.channel;
    //Trying to join the voice channel.
    voiceChannel.join().then(connection =>{
        //Initializing
        client.musicCache[serverID].init(textID, voiceID, connection, message.guild);
        //Self-deafening
        connection.voice.setSelfDeaf(true);
        //Sending message
        message.channel.send(`Successfully joined **${voiceChannel.name}** and bound to **${textChannel.name}.**`);
        end = 1;
        if(callback) callback(end);
        return end;
    }).catch(err => {
        console.log(err);
        message.channel.send(`Unable to join your voice channel!`);
        end = 0;
        if(callback) callback(end);
        return end;
    });
}
module.exports.help = {
    name: ["join"],
    description: "Call the dino!",
    page: 1,
    title: "Music Commands"
};
  