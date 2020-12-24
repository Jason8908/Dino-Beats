module.exports.run = async (client, message, args) => {
    //Constants
    const search = require('youtube-search');
    const ytdl = require('ytdl-core');
    const userID = message.author.id;
    const serverID = message.guild.id;
    const prism = require('prism-media');
    const username = message.author.username;
    const guild = message.guild;
    //Utils.
    let node = require('../utilities/utils.js').queueNode;
    let sToT = require('../utilities/utils.js').sToT;
    //Guild music cache
    let cache = client.musicCache[serverID];
    //Search query
    let query = args.join(" ");
    var opts = {
        maxResults: 10,
        type: 'video',
        key: 'empty'
    };
    //Joining the channel if the bot isn't already in one.
    if(!client.musicCache[serverID].voice) {
        commands['join'].run(client, message, args, async function(res) {
            if(res < 1) return false;
            message.channel.send(`Searching **Youtube** <:youtube:766415814223593522> for **${args.join(' ')}**!`);
            //Searching for the results
            search(query, opts, async (err, results) => {
                //Logging error.
                if(err) {
                    if(err.response.status == 403) message.channel.send('The bot has run out of quota for the Youtube search API... I am looking for ways to expand more quota, but until then, it would be great if you could wait until tomorrow! So sorry.');
                    cache.connection.disconnect();
                    let channel = guild.channels.cache.get(cache.text);
                    if(channel) channel.leave();
                    cache.denit();
                    return console.log(err);
                };
                //No results.
                if(!results) {
                    message.channel.send(`There were no results found for the query: **${query}**`);
                    return false;
                };
                //Making queue node.
                let title = results[0].title, user = message.author.username, link = results[0].link;
                //Getting time
                let info = await ytdl.getInfo(link);
                let seconds = info.videoDetails.lengthSeconds;
                let length = sToT(seconds);
                //Pushing to the queue.
                let nodeSong = new node(title, user, link, length)
                cache.queue.push(nodeSong);
                //Getting input and playing song
                let input = await ytdl(link, {
                    filter: "audioonly",
                    highWaterMark: 1<<25
                });
                const dispatcher = await cache.connection.play(input);
                dispatcher.setVolume(0.15);
                //Updating dispatcher variable.
                cache.play(dispatcher);
                //setting when finished function
                dispatcher.on('finish', async () => {
                    //Setting active to false.
                    cache.active = false;
                    cache.next(client);
                });
                //Getting user avatar URL
                let avatar = message.author.avatarURL();
                //Thumbnail image.
                let thumbnail = results[0].thumbnails.default.url;
                //Channel 
                let channel = results[0].channelTitle;
                //Sending message.
                let val = (cache.queue.indexOf(nodeSong)) < 1 ? 'Now Playing!':cache.queue.indexOf(nodeSong);
                message.channel.send({embed: {
                    author: {
                      name: 'Now Playing',
                      icon_url: avatar
                    },
                    title: title,
                    url: link,
                    thumbnail: {
                        url: thumbnail
                    },
                    fields: [
                        {
                            name: 'Channel',
                            value: channel,
                            inline: true
                        },
                        {
                            name: 'Song Length',
                            value: cache.queue[0].length,
                            inline: true
                        },
                        {
                            name: 'Queue Position',
                            value: val
                        }
                    ]
                }});
            });
            //End of first search
            return true;
        });
    }
    else {
        message.channel.send(`Searching **Youtube** <:youtube:766415814223593522> for **${args.join(' ')}**!`);
        //Searching for the results
        search(query, opts, async (err, results) => {
            //Logging error.
            if(err) {
                if(err.response.status == 403) message.channel.send('The bot has run out of quota for the Youtube search API... I am looking for ways to expand more quota, but until then, it would be great if you could wait until tomorrow! So sorry.');
                cache.connection.disconnect();
                let channel = guild.channels.cache.get(cache.text);
                if(channel) channel.leave();
                cache.denit();
                return console.log(err);
            };
            //No results.
            if(!results) {
                message.channel.send(`There were no results found for the query: **${query}**`);
                return false;
            };
            //Making queue node.
            let title = results[0].title, user = message.author.username, link = results[0].link;
            //Getting time
            let info = await ytdl.getInfo(link).catch(err => {
                console.log(err);
                message.channel.send('There was an unexpected error... Please try again!');
                return false;
            });
            let seconds = info.videoDetails.lengthSeconds;
            let length = sToT(seconds);
            //Pushing to the queue.
            let nodeSong = new node(title, user, link, length)
            cache.queue.push(nodeSong);
            if(cache.queue.length == 1) {
                //Getting input and playing song
                let input = await ytdl(link, {
                    filter: "audioonly",
                    highWaterMark: 1<<25
                });
                const dispatcher = await cache.connection.play(input);
                dispatcher.setVolume(0.15);
                //Updating dispatcher variable.
                cache.play(dispatcher);
                //setting when finished function
                dispatcher.on('finish', async () => {
                    //Setting active to false.
                    cache.active = false;
                    cache.next(client);
                });
                //Getting user avatar URL
                let avatar = message.author.avatarURL();
                //Thumbnail image.
                let thumbnail = results[0].thumbnails.default.url;
                //Channel 
                let channel = results[0].channelTitle;
                //Sending message.
                val = (cache.queue.indexOf(nodeSong)) < 1 ? 'Now Playing!':cache.queue.indexOf(nodeSong);
                message.channel.send({embed: {
                    author: {
                      name: 'Now Playing',
                      icon_url: avatar
                    },
                    title: title,
                    url: link,
                    thumbnail: {
                        url: thumbnail
                    },
                    fields: [
                        {
                            name: 'Channel',
                            value: channel,
                            inline: true
                        },
                        {
                            name: 'Song Length',
                            value: cache.queue[cache.queue.length-1].length,
                            inline: true
                        },
                        {
                            name: 'Queue Position',
                            value: val
                        }
                    ]
                }});
            }
            else if (cache.queue.length > 1) {
                //Getting user avatar URL
                let avatar = message.author.avatarURL();
                //Thumbnail image.
                let thumbnail = results[0].thumbnails.default.url;
                //Channel 
                let channel = results[0].channelTitle;
                //Sending message.
                message.channel.send({embed: {
                    author: {
                      name: 'Added to Queue',
                      icon_url: avatar
                    },
                    title: title,
                    url: link,
                    thumbnail: {
                        url: thumbnail
                    },
                    fields: [
                        {
                            name: 'Channel',
                            value: channel,
                            inline: true
                        },
                        {
                            name: 'Song Length',
                            value: cache.queue[cache.queue.length-1].length,
                            inline: true
                        },
                        {
                            name: 'Queue Position',
                            value: (cache.queue.indexOf(nodeSong)) < 1 ? 'Now Playing!':cache.queue.indexOf(nodeSong)
                        }
                    ]
                }});
            }
        });
        //End of second search
        return true;
    };
};
module.exports.help = {
    name: ["play", "p"],
    description: "Play music!",
    page: 1,
    title: "Music Commands"
};