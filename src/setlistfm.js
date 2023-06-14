import axios from "axios";
import uniqBy from "lodash/uniqBy";

import dotenv from "dotenv";
dotenv.config();

const { SETLIST_FM_API_KEY: apiKey } = process.env;

const getSetlists = async (artist, number = 2) => {
  console.info(`Searching for artist: ${artist}`);
  const response = await axios.get(
    `https://api.setlist.fm/rest/1.0/search/artists?artistName=${artist}&sort=relevance`,
    { headers: { "x-api-key": apiKey, Accept: "application/json" } }
  );
  const actual = response.data.artist.find(
    (a) => a.name.toLowerCase() === artist.toLowerCase()
  );

  if (!actual) {
    throw new Error("No artist found");
  }

  console.info(`Found artist with name: ${actual.name}`);
  console.info(`Searching for the latest ${number} setlists`);

  const setlists = await axios.get(
    `https://api.setlist.fm/rest/1.0/artist/${actual.mbid}/setlists`,
    { headers: { "x-api-key": apiKey, Accept: "application/json" } }
  );

  const filtered = setlists.data.setlist.filter((s) => s.sets.set.length);
  const allSongs = uniqBy(
    filtered
      .map((set) => set.sets.set.map((s) => s.song).flat(1))
      .flat(1)
      .filter((song) => !song.tape),
    "name"
  );
  console.info(
    `Found ${allSongs.length} unique songs from ${number} setlists.`
  );
  return allSongs;
};

export default getSetlists;
