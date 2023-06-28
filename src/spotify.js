import axios from "axios";
import uniq from "lodash/uniq";
import dotenv from "dotenv";
import { sanitize } from "string-sanitizer";

import { getSetlists } from "./setlistfm";
import { PORT } from "./server";

dotenv.config();
const { SPOTIFY_CLIENT, SPOTIFY_SECRET } = process.env;

export const callback = async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios({
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      data: {
        grant_type: "authorization_code",
        code,
        redirect_uri: `http://localhost:${PORT}/callback`,
        client_id: SPOTIFY_CLIENT,
        client_secret: SPOTIFY_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(`${SPOTIFY_CLIENT}:${SPOTIFY_SECRET}`).toString(
          "base64",
        )}`,
      },
    });

    const accessToken = tokenResponse.data.access_token;
    const { refreshToken } = tokenResponse.data;

    req.session.accessToken = accessToken;

    res.redirect("/search");
    // process.exit();
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("An error occurred");
  }
};

const getPlaylistItems = async (playlistId, accessToken) => {
  const {
    data: { items },
  } = await axios({
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return items;
};

const getTrackUris = (tracks, limit, existingIds, sort) => {
  // If there are more than x tracks, sort by popularity and use the first x
  let uris = [];

  if (sort === "popularity") {
    uris = uniq(tracks.sort((a, b) => b.popularity - a.popularity))
      .filter(response => existingIds.indexOf(response.uri) === -1)
      .slice(0, limit)
      .map(response => response.uri);
  }
  if (sort === "set") {
    uris = uniq(tracks.sort((a, b) => a.order - b.order))
      .filter(response => existingIds.indexOf(response.uri) === -1)
      .slice(0, limit)
      .map(response => response.uri);
  }

  console.log(`Adding ${uris.length} tracks to playlist...`);
  return uris;
};

const getCurrentUser = async accessToken => {
  try {
    return await axios({
      url: "https://api.spotify.com/v1/me",
      method: "GET",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    console.log("getCurrentUser: ", e);
    return e;
  }
};

const createPlaylist = async (accessToken, name, userId) => {
  const { data } = await axios({
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    method: "POST",
    data: {
      name,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};

export const createPlaylistRequest = async (req, res) => {
  if (!req.session.accessToken) {
    res.redirect("/login");
    return;
  }
  const {
    data: { id },
  } = await getCurrentUser(req.session.accessToken);

  const data = await createPlaylist(req.session.accessToken, req.body.name, id);

  console.log(`Created playlist ${req.body.name}!`);
  res.send(data);
};

const addToPlaylist = async (playlistId, uris, accessToken) => {
  await axios({
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    method: "POST",
    data: {
      uris,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log("Added!");
};

export const getTracks = async (artistName, tracks, accessToken) => {
  const promises = [];

  tracks.forEach(async ({ name, order }) => {
    console.log(
      `Searching for ${artistName} ${name} (${encodeURIComponent(
        `${sanitize(artistName)} ${sanitize.keepSpace(name)}`,
      )})`,
    );

    promises.push(
      axios({
        method: "GET",
        url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          `${sanitize(artistName)} ${sanitize.keepSpace(name)}`,
        )}&type=track`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        meta: { artistName, name, order },
      }),
    );
  });
  const results = await Promise.all(promises);

  const foundTracks = [];
  results.forEach(({ data, config: { meta } }) => {
    if (
      data.tracks.items.find(
        t =>
          t.artists.find(
            a => sanitize(a.name).toLowerCase() === sanitize(meta.artistName).toLowerCase(),
          ) && sanitize(t.name).toLowerCase() === sanitize(meta.name).toLowerCase(),
      )
    ) {
      foundTracks.push({
        ...data.tracks.items.find(
          t =>
            t.artists.find(
              a => sanitize(a.name).toLowerCase() === sanitize(meta.artistName).toLowerCase(),
            ) && sanitize(t.name).toLowerCase() === sanitize(meta.name).toLowerCase(),
        ),
        order: meta.order,
      });
    }
  });

  console.log(`${foundTracks.length} results found out of ${promises.length}`);
  return foundTracks;
};

export const search = async (req, res) => {
  try {
    if (!req.session.accessToken) {
      res.redirect("/login");
      return;
    }

    let { playlistId, sort, depth } = req.body;
    const { artist: artistName } = req.body;

    if (!sort) {
      sort = "popularity";
    }
    if (!depth) {
      depth = 2;
    }

    if (req.body?.playlistName) {
      const {
        data: { id },
      } = await getCurrentUser(req.session.accessToken);

      const result = await createPlaylist(req.session.accessToken, req.body.playlistName, id);
      playlistId = result.id;
    }

    const tracks = await getSetlists(artistName, depth);

    let limit = 10;

    if (!playlistId) {
      res.send(422);
      return;
    }

    if (req.body.limit) {
      limit = Number(req.body.limit);
    }

    if (!req.session.accessToken) {
      res.redirect("/login");
      return;
    }

    const spotifyTracks = await getTracks(artistName, tracks, req.session.accessToken);

    const items = await getPlaylistItems(playlistId, req.session.accessToken);
    const existingIds = items
      .filter(i => i.track.artists.find(a => a.name.toLowerCase() === artistName.toLowerCase()))
      .map(i => i.track.uri);

    const uris = getTrackUris(spotifyTracks, limit, existingIds, sort);

    await addToPlaylist(playlistId, uris, req.session.accessToken);

    res.redirect("/search?success=1");
  } catch (e) {
    console.log(e.message);
    res.send(500);
  }
};

const getPlaylists = async (url, accessToken) => {
  const { data } = await axios({
    url,
    method: "GET",

    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return { data };
};

export const getUserPlaylists = async (req, res) => {
  try {
    if (!req.session.accessToken) {
      res.redirect("/login");
      return;
    }

    const {
      data: { id },
    } = await getCurrentUser(req.session.accessToken);
    const allData = [];

    const { data } = await getPlaylists(
      `https://api.spotify.com/v1/users/${id}/playlists?limit=50`,
      req.session.accessToken,
    );
    allData.push(data.items);

    if (data?.total > 50) {
      const promises = [];
      for (let i = 0; (i + 1) * 50 < data.total; i += 1) {
        promises.push(
          getPlaylists(
            `https://api.spotify.com/v1/users/${id}/playlists?limit=50&offset=${(i + 1) * 50}`,
            req.session.accessToken,
          ),
        );
      }
      const responses = await Promise.all(promises);
      responses.forEach(({ data }) => {
        allData.push(data.items);
      });
    }

    return res.send(allData.flat(1));
  } catch (e) {
    console.log(e.message);
    res.send(e.message);
  }
};
