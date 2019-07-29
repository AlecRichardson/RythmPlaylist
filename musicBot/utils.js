const playlistPath = fileName => `./musicBot/playlists/${fileName}.txt`;

const isYtUrl = url => {
    const pattern = new RegExp('^https://www.youtube.com.*$');

    return !!pattern.test(url);
};

const createUrl = id => `https://www.youtube.com/watch?v=${id}`;

exports.playlistPath = playlistPath;
exports.isYtUrl = isYtUrl;
exports.createUrl = createUrl;
