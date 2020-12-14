module.exports.run = async (client, message, args) => {
    let page = +args[0];
    if(!page || page < 1 || page > commands.helpPage.length) page = 1;
    //Display the help page to user
    message.channel.send({embed: {
        color: 3447003,
        title: "Help",
        fields: commands.helpPage[page-1],
        image: {
            url: 'https://i.imgur.com/XQBd1Es.png',
        },
        footer: {
            text: `Help Page ${page}/${commands.helpPage.length}`
        }
    }});
}

module.exports.help = {
    name: ["help"],
    description: "View all other commands!",
    page: 1,
    title: "Music Commands"
};