const searchYoutube = require('youtube-api-v3-search');

const search = async q => {
    const options = {
        q,
        part: 'snippet',
        type: 'video'
    };

    return await searchYoutube(process.env.YT_API_KEY, options);
};

exports.search = search;
