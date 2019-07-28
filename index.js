const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
require('dotenv').config();

const utils = require('./utils');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.BOT_KEY);

client.on('message', msg => {
    // if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = msg.content.substr(msg.content.indexOf(' ') + 1);
    const command = msg.content.substr(0, msg.content.indexOf(' ')).toLowerCase();
    console.log('command: ', command);
    console.log('args: ', args);
    if (command === '/create') {
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

    if (command === '/add') {
        const playlist = args.substr(0, args.indexOf(' '));
        const song = args.substr(args.indexOf(' ') + 1);

        if (playlist.length == 0 || song.length == 0) {
            msg.reply(
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
    }

    if (command === '/play') {
        const path = utils.playlistPath(args);
        if (!fs.existsSync(path)) {
            return msg.reply(
                'A playlist with that name does not exist, try again or create a playlist using\n```/create <playlistName>```'
            );
        }

        let songs = fs
            .readFileSync(path)
            .toString()
            .split('\n');

        msg.reply(`Queueing playlist ${args}`);
        let message = '```';
        songs.forEach(song => {
            message += `!play ${song}\n`;
        });
        message += '```';
        msg.channel.send(message);
    }
});
