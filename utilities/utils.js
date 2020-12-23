//Music node.
class queueNode {
    constructor(name, user, link, length) {
        this.title = name;
        this.requestBy = user;
        this.link = link;
        this.length = length;
    }
}
//Formatting time.
function timeFormat(seconds) {
    let hrs = ~~(seconds / 3600);
    let mins = ~~((seconds % 3600) / 60);
    let secs = ~~seconds % 60;

    var out = "";

    if (hrs > 0) {
        out += hrs + ":" + (mins < 10 ? "0" : "");
    };

    out += mins + ":" + (secs < 10 ? "0" : "");
    out += secs;
    return out;
};
//Queue object.
class Queue {
    constructor(newQueue, newClient) {
        this.queue = newQueue.slice(1).split2D(6);
        this.D1 = newQueue;
        this.message = null;
        this.page = 1;
        this.total = Math.ceil(newQueue.length/6);
        this.time = null;
        this.collector = null;
        this.client = newClient;
        this.guild = null;
    }
    messageMake(message, page) {
        page-=1;
        message += '__Current Queue__\n'
        if(this.D1.length > 1) {
            for(let i = 0; i < this.queue[page].length; i++) {
                let pos = this.D1.indexOf(this.queue[page][i]);
                pos++;
                message += `\`\`${[pos]}.\`\` **${this.queue[page][i].title}** | ` + "`" + `${this.queue[page][i].length} Requested by: ${this.queue[page][i].requestBy}.` + "`" + '\n\n';
            };
        }
        else message += `*Nothing currently!*\n`;
        return message;
    }
    init(newMessage, guildID, guildName) {
        const Discord = require('discord.js');
        this.guild = {id: guildID, name: guildName};
        this.message = newMessage;
        this.page = 1;
        let obj = this;
        //Collecting reactions.
        //Filter
        const filter = (reaction, user) => {
            return (reaction.emoji.name === '⬆️' || reaction.emoji.name === '⬇️') && user.id != this.client.user.id;
        };
        this.collector = this.message.createReactionCollector(filter, { time: 600000 });
        this.collector.on('collect', async r => {
            //Checking if on edges of page limits.
            if(r.emoji.name == '⬆️' && this.page != 1) this.page--;
            else if(r.emoji.name == '⬇️' && this.page != this.total) this.page++;
            else return;
            //Creating new embeds and editing the message.
            let songs = `__Now Playing__\n **${this.D1[0].title}** | ` + "`" + `${this.D1[0].length} Requested by: ${this.D1[0].requestBy}.` + "`" + '\n\n';
            songs = this.messageMake(songs, this.page);
            //Making the embed.
            let newEdit = new Discord.MessageEmbed()
                .setColor('0x3090B4')
                .setTitle(`${this.guild.name} Music Queue`)
                .addFields(
                    { name: 'Songs', value: `${songs}` },
                )
                .setFooter(`Page ${this.page}/${this.total}`, `${this.message.author.displayAvatarURL()}`);
            //Editing the message.
            this.message.edit(newEdit);
        })
        //Setting a timeout for this to get destroyed.
        this.time = setTimeout(function() {
            obj.destroy();
        }, 600000);
    }
    destroy() {
        this.queue = null;
        this.D1 = null;
        this.message = null;
        this.page = null;
        this.total = null;
        this.time = null;
        this.collector = null;
        this.guild = null;
    }
}
//To split into a 2D Array.
Array.prototype.split2D = function(numPer = 2) {
    let out = [];
    let rows = Math.ceil(this.length/numPer);
    let j = 0;
    for(let i = 0; i < rows; i++) out.push([]);
    for(let i = 0; i < rows; i++) {
        for(let x = 0; x < numPer; x++) {
            if(j>=this.length) break;
            out[i][x] = this[j];
            j++;
        };
    };
    return out;
};

module.exports.queueNode = queueNode;
module.exports.sToT = timeFormat;
module.exports.queue = Queue;