import request_p from "request-promise";
import fs from 'fs';

/* ---------- */

const BEATSABER_FOLDER = 'D:\\Games\\Steam\\SteamApps\\common\\Beat Saber';
const ROOM_NAME = "VAN ZEBEN'S ROOM";
const PASSWORD = "RYAN";

/* ---------- */

const error = (err) => {
    console.error(err);
    return exit(0);
};
const getPlaylist = async (playlistName) => {
    if (!playlistName) {
        return error("Please enter a playlist name");
    }
    var playlist = JSON.parse(fs.readFileSync(`${BEATSABER_FOLDER}\\Playlists\\${playlistName}.json`, 'utf8'));
    if (!playlist) {
        return error(`Could not find a playlist name \"${playlistName}\"`);
    }
    const songs = [];
    for (const song of playlist.songs) {
        const data = await request_p({
            url: `https://beatsaver.com/api/songs/detail/${song.key}`,
            json: true
        })
        songs.push({
            Key: data.song.key,
            name: data.song.name,
            HashMD5: data.song.hashMd5,
        })
    }
    return {
        settings: {
            Name: ROOM_NAME,
            UsePassword: PASSWORD.length > 0,
            Password: PASSWORD,
            SelectionType: 0,
            MaxPlayers: 5,
            NoFail: true
        },
        songs
    };
}

const convertPlaylist = async (playlistName) => {
    playlistName = `${playlistName}`.toUpperCase();
    const playlist = await getPlaylist(playlistName);
    fs.writeFileSync(`${BEATSABER_FOLDER}\\UserData\\RoomPresets\\${playlistName}.json`, JSON.stringify(playlist), 'utf8');
};

convertPlaylist(process.argv[2]);