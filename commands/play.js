module.exports.run = async (client, message, args) => {
    //Constants
    const search = require('youtube-search');
    const ytdl = require('ytdl-core');
    const userID = message.author.id;
    const serverID = message.guild.id;
    const prism = require('prism-media');
    const username = message.author.username;
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
        key: 'AIzaSyBxJsI9a856fUbauCYgYeMyN6Ox3woE24M'
    };
    //Joining the channel if the bot isn't already in one.
    if(!client.musicCache[serverID].voice) {
        commands['join'].run(client, message, args, async function(res) {
            if(res < 1) return false;
            message.channel.send(`Searching **Youtube** <:youtube:766415814223593522> for **${args.join(' ')}**!`);
            //Searching for the results
            search(query, opts, async (err, results) => {
                //Logging error.
                if(err) return console.log(err);
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
            if(err) return console.log(err);
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
                const pcm = input.pipe(new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 }));
                const dispatcher = await cache.connection.play(pcm, {type: 'converted'});
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

    






























    /*
    let queue = serverMusicFile[serverID].queue;

    let link = args[0];

    if(!link) return;

    let voiceChannel = message.member.voiceChannel;
    if(!voiceChannel) {
        message.channel.send({embed: {
            color: 0xff0000,
            description: `<@${userID}> You must be in a voice channel in order to make use of this command.`
        }});
        return;
    };

    let input;

    try {
        input = await ytdl(link, {
            filter: "audioonly",
            highWaterMark: 1<<25
        });
    }
    catch(err) {
        message.channel.send({embed: {
            color: 0xff0000,
            description: `<@${userID}> Please enter a valid youtube video link.`
        }});
        return;
    };

    let connection;
    let botChannel = message.guild.voiceConnection;
    try {
        connection = await voiceChannel.join();
    }
    catch(err) {
        if(!botChannel) {
            message.channel.send({embed: {
                color: 0xff0000,
                description: `**Failed to join user's channel**`
            }}); 
        };
        return;
    }
    if(!botChannel) {
        message.channel.send({embed: {
            color: 0xffff00,
            description: `**Successfully joined ${voiceChannel.name}**`
        }});
    };

    let songTitle = await ytdl.getInfo(link, async (_err, info) => {
        return info.title;
    });

    let secondsLength =+ await ytdl.getInfo(link, async (_err, info) => {
        return info.length_seconds;
    });

    let songLength = timeFormat(secondsLength);

    if(queue.length < 1) {
        const pcm = input.pipe(new prism.opus.Decoder({ rate: 48000, channels: 2, frameSize: 960 }));
        queue.push(new queueNode(songTitle, username, link, songLength));
        message.channel.send({embed: {
            color: 0x00ff00,
            description: `**Playing ${songTitle}.**`
        }});
        serverMusicFile[serverID].queue = queue;
        fs.writeFileSync(serverMusicPath, JSON.stringify(serverMusicFile, null, 2));

        const DISP = await connection.playConvertedStream(pcm);
        DISP.setVolume(0.1);

        for(let i = 0; i < dispatchers.length; i++) if(dispatchers[i].guild == serverID) dispatchers[i].dispatch = DISP;

        DISP.on('end', () => {
            const fs = require('fs');
            let serverMusicPath = 'serverMusic.json';
            let serverMusicRead = fs.readFileSync(serverMusicPath, 'utf8');
            let serverMusicFile = JSON.parse(serverMusicRead); //reading the file again

            let queue = serverMusicFile[serverID].queue;
            playNext(fs, queue, serverMusicFile, ytdl, connection);
        });
        return;
    };

    queue.push(new queueNode(songTitle, username, link, songLength));
    serverMusicFile[serverID].queue = queue;
    fs.writeFileSync(serverMusicPath, JSON.stringify(serverMusicFile, null, 2));

    message.channel.send({embed: {
        color: 0x00ff00,
        description: `**Added ${songTitle} to the queue!**`
    }});
    */

module.exports.help = {
    name: ["play", "p"],
    description: "Play music!",
    page: 1,
    title: "Music Commands"
};