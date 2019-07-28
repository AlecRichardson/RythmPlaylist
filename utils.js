const playlistPath = fileName => `./playlists/${fileName}.txt`;

const execute = async (message, serverQueue) => {
    const args = message.content.split(' ');
    const voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.channel.send('I need the permissions to join and   speak in your voice channel!');
    }
};

exports.playlistPath = playlistPath;
exports.execute = execute;
