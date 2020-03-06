const execSync = require('child_process').execSync;
const fs = require('fs');
const axios = require('axios');

const getVideoCode = (url) => {
    try{
        let res = url.substring(29);
        let i = 0;
        while (i < res.length && '0123456789'.indexOf(res[i]) !== -1) i += 1;
        return res.substring(0, i);
    } catch (err){
        return url;
    }
}

const getChat = (id) => {
    fs.writeFileSync(`../assets/data/${id}.done`,'False');
    console.log(__dirname);
    dir = execSync(`tcd -v ${id} --format irc --client-id 137oh7nvyaimf0yntfsjakm6wsvcvx`,  
        {
            maxBuffer: 1024 * 1024 * 64,
            cwd: __dirname + '/../assets/data'
        });
    // Even if error, it is still done, because this problem is unsolved.
    fs.writeFileSync(`../assets/data/${id}.done`,'True');
}

const checkVideos = (code) => {
    if (!fs.existsSync(`../assets/data/${code}.done`)) {
        try{
            getChat(code);
        } catch (err) {
            console.log(err);
        }
    }
}

const scanVideos = (game) => {
    let headers = { 'Client-ID': '137oh7nvyaimf0yntfsjakm6wsvcvx', 'Accept': 'application/vnd.twitchtv.v5+jso'};

    axios.get(`https://api.twitch.tv/kraken/videos/top?limit=100&broadcast_type=archive,upload&game=${game}&language=en`, { headers: headers})
    .then(function (response) {
        for (let j = 0; j < response.data.vods.length; j++)
            checkVideos(getVideoCode(response.data.vods[j].url));
    })
    .catch(function (error) {
        console.log(error);
    });
}

const scanGames = () => {
    let headers = { 'Client-ID': '137oh7nvyaimf0yntfsjakm6wsvcvx', 'Accept': 'application/vnd.twitchtv.v5+jso'};
    
    axios.get('https://api.twitch.tv/kraken/games/top?limit=20', { headers: headers})
    .then(function (response) {
        for (let i = 0; i < response.data.top.length; i++)
            scanVideos(response.data.top[i].game.name);
    })
    .catch(function (error) {
        console.log(error);
    });
}

const cleanFiles = () => {
    // remove old logs files
    dir = execSync('find . -type f -mtime +5 -exec rm -f {} \;',  
    {
        maxBuffer: 1024 * 1024 * 64,
        cwd: __dirname + '/../assets/data'
    });
}

const scanVODs = () => {
    cleanFiles();
    scanGames();

    //scanVideos("League of Legends"); // Scan only League fo Legends

    setInterval(scanVODs, 12 * 60 * 60 * 1000); // Repeat in 12 hour
}

module.exports = {scanVODs};
