module.exports.run = async (client, message, args) => {
    const userID = message.author.id;
    const serverID = message.guild.id;
    //Getting the number to remove.
    let id = args[0];
    //Getting music queue.
    let queue = client.musicCache[serverID].queue;
    //Checking for positive id.
    if(!id || isNaN(+id) || id < 1) {
        message.channel.send('That is an **invalid number!** Enter a valid number of the song you wish to remove.');
        return;
    };
    //Checking for queue.
    if(!queue.length) {
        message.channel.send({embed: {
            color: 0xff0000,
            description: `**Nothing is currently playing.**`
        }});
        return;
    };
    //Trying to remove the song.
    client.musicCache[serverID].remove(id).then(res => {
        message.channel.send(`Successfully removed **${res.title}** from the queue!`);
    }).catch(err => {
        console.log(err);
        message.channel.send('I was **unable** to remove that song! Try again...');
    });
};

module.exports.help = {
    name: ['remove'],
    description: "Remove a song from the queue. \`*remove [queue position]\`",
    page: 1,
    title: "Music Commands"
};