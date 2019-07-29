const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const _ = require('lodash');
const ytdl = require('ytdl-core');
require('dotenv').config();

const utils = require('./utils');
const constants = require('./constants');
const api = require('./api');

let servers = {};

let play = (conn, msg) => {
    let server = servers[msg.guild.id];

    server.dispatcher = conn.playStream(ytdl(server.queue[0], { filter: 'audioonly' }));

    server.queue.shift();

    server.dispatcher.on('end', () => {
        if (server.queue[0]) play(conn, msg);
        else conn.disconnect();
    });
};

let queue = (url, msg) => {
    servers[msg.guild.id].queue.push(url);
};

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.BOT_KEY);

client.on('message', msg => {
    const args = msg.content.substr(msg.content.indexOf(' ') + 1);
    let command = msg.content.substr(0, msg.content.indexOf(' ')).toLowerCase();

    if (_.isEmpty(command)) {
        command = args;
    }
    console.log('msg: ', msg.content);
    if (!msg.content.startsWith(constants.PREFIX) || msg.author.bot || !msg.guild) return;
    console.log('command: ', command);
    console.log('args: ', args);
    if (_.isEqual(command, `${constants.PREFIX}create`)) {
        if (fs.existsSync(utils.playlistPath(args))) {
            return msg.reply('A playlist with that name already exists, try another one.');
        }
        msg.reply(
            `Creating new playlist ${args}! To add to this playlist use\n\`\`\`/add <playlistName> <songTitle>\`\`\``
        );
        fs.appendFile(utils.playlistPath(args), '', err => {
            if (err) throw err;
        });
    }

    if (_.isEqual(command, `${constants.PREFIX}add`)) {
        const playlist = args.substr(0, args.indexOf(' '));
        const song = args.substr(args.indexOf(' ') + 1);

        if (_.isEmpty(playlist) || _.isEmpty(song)) {
            return msg.reply(
                'The add command requires two arguments, the name of the playlist to add to and the name of the song title.\n```/add <playlistName> <songTitle>```'
            );
        }

        if (!fs.existsSync(utils.playlistPath(playlist))) {
            return msg.reply(
                'A playlist with that name does not exist, try again or create a playlist using\n```/create <playlistName>```'
            );
        }

        fs.appendFile(utils.playlistPath(playlist), `${song}\n`, err => {
            if (err) throw err;
        });

        msg.reply(`Successfully added the song '${song} to the playlist ${playlist}`);
    }

    if (_.isEqual(command, `${constants.PREFIX}queue`)) {
        const path = utils.playlistPath(args);
        let urls = [];
        // let server = servers[msg.guild.id];
        if (!fs.existsSync(path)) {
            return msg.reply(
                'A playlist with that name does not exist, try again or create a playlist using\n```/create <playlistName>```'
            );
        }

        let songs = fs
            .readFileSync(path)
            .toString()
            .split('\n');

        if (!servers[msg.guild.id]) {
            servers[msg.guild.id] = {
                queue: []
            };
        }

        api.search('yippie').then(res => {
            servers[msg.guild.id].queue.push(utils.createUrl(res.items[0].id.videoId));
            try {
                msg.member.voiceChannel.join().then(conn => {
                    play(conn, msg);
                });
            } catch {
                console.log('error');
            }
        });

        console.log('queue: ', servers[msg.guild.id].queue);
        // msg.reply(`Queueing playlist ${args}`);
        // try {
        //     msg.member.voiceChannel.join().then(conn => {
        //         play(conn, msg);
        //     });
        // } catch {
        //     console.log('error');
        // }
    }

    if (_.isEqual(command, `${constants.PREFIX}join`)) {
        if (msg.member.voiceChannel) {
            msg.member.voiceChannel
                .join()
                .then(() => {
                    console.log('Succesfully connected');
                })
                .catch(err => {
                    console.log('Error connecting: ', err);
                });
        } else {
            msg.reply('You must be in a voice channel to summon Music Bot');
        }
    }

    if (_.isEqual(command, `${constants.PREFIX}disconnect`) || _.isEqual(command, `${constants.PREFIX}dc`)) {
        msg.member.voiceChannel.leave();
    }

    if (_.isEqual(command, `${constants.PREFIX}play`)) {
        let server = servers[msg.guild.id];
        if (utils.isYtUrl(args)) {
            console.log('true');
            servers[msg.guild.id] = {
                queue: [args]
            };

            msg.reply(`Starting song: ${args}`);
            try {
                msg.member.voiceChannel.join().then(conn => {
                    play(conn, msg);
                });
            } catch {
                console.log('error');
            }
        } else {
            console.log('false');
            // Search youtube and play the first result.
            api.search(args)
                .then(res => {
                    console.log('res: ', res);
                    console.log('id: ', res.items[0].id.videoId);
                    servers[msg.guild.id] = {
                        queue: []
                    };
                    try {
                        msg.member.voiceChannel.join().then(conn => {
                            play(conn, msg);
                        });
                    } catch {
                        console.log('error');
                    }
                })
                .catch(err => {
                    console.log('err: ', err);
                });
        }
    }
});
