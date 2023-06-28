import axios from "axios";
import groupBy from "lodash/groupBy";
import max from "lodash/max";
import uniqBy from "lodash/uniqBy";

import dotenv from "dotenv";

dotenv.config();

const { SETLIST_FM_API_KEY: apiKey } = process.env;

export const getSetlists = async (artist, number = 2) => {
  console.info(`Searching for artist: ${artist}`);
  const response = await axios.get(
    `https://api.setlist.fm/rest/1.0/search/artists?artistName=${artist}&sort=relevance`,
    { headers: { "x-api-key": apiKey, Accept: "application/json" } },
  );
  const actual = response.data.artist.find(a => a.name.toLowerCase() === artist.toLowerCase());

  if (!actual) {
    throw new Error("No artist found");
  }

  console.info(`Found artist with name: ${actual.name}`);
  console.info(`Searching for the latest ${number} setlists`);

  const setlists = await axios.get(
    `https://api.setlist.fm/rest/1.0/artist/${actual.mbid}/setlists`,
    { headers: { "x-api-key": apiKey, Accept: "application/json" } },
  );
  const filtered = setlists.data.setlist.filter(s => s.sets.set.length);
  const withOrder = filtered.slice(0, number).map(setlist => ({
    ...setlist,
    sets: {
      set: setlist.sets.set
        .map(s => s.song)
        .flat(1)
        .filter(song => !song.tape)
        .map((song, index) => ({ ...song, order: index + 1 })),
    },
  }));

  const uniqByNameAndOrder = uniqBy(withOrder.map(set => set.sets.set).flat(1), a =>
    [a.name, a.order].join(),
  )
    .sort((a, b) => a.name - b.name)
    .sort((a, b) => a.order - b.order);

  const grouped = groupBy(uniqByNameAndOrder, "name");

  const allSongs = [];
  Object.entries(grouped).forEach(([key, value]) => {
    if (value.length === 1) {
      allSongs.push({ ...grouped[key][0] });
    } else {
      const groupedByOrder = groupBy(value, s => [s.name, s.order].join());
      const arr = [];

      Object.keys(groupedByOrder).forEach(k => {
        arr.push(Number(k.split(",")[1]));
      });
      allSongs.push({ ...grouped[key][0], order: max(arr) });
    }
  });

  console.info(`Found ${allSongs.length} unique songs from ${number} setlists.`);
  return allSongs;
};

export default getSetlists;
