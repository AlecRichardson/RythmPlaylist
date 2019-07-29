const playlistPath = fileName => `./musicBot/playlists/${fileName}.txt`;

const isYtUrl = url => {
    const pattern = new RegExp('^https://www.youtube.com.*$');

    return !!pattern.test(url);
};

exports.playlistPath = playlistPath;
exports.isYtUrl = isYtUrl;
