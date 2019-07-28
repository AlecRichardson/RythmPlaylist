const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.login('NTM2MzIwNjkxNzcxOTMyNzAy.D05Fbw.9p2lud6VgTkbSzrHH3qX91l-v-c')

client.on('message', msg => {
    // if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = msg.content.substr(msg.content.indexOf(' ') + 1)
    const command = msg.content
        .substr(0, msg.content.indexOf(' '))
        .toLowerCase()
    console.log('command: ', command)
    console.log('args: ', args)
    if (command === '/create') {
        if (fs.readFileSync(`${args}.txt`)) {
            msg.reply('')
        }
        msg.reply(`Creating new playlist ${args}! To add to this playlist...`)
        fs.appendFile(`${args}.txt`, '', err => {
            if (err) throw err

            console.log('Playlist created!')
        })
    }
})
// fs.appendFile("Output.txt", data, err => {
//   // In case of a error throw err.
//   if (err) throw err;
// });

let file = fs.readFileSync('Output.txt', 'utf8')
console.log('test: ', file.split('\n'))
