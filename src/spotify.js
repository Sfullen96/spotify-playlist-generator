import axios from "axios";
import uniq from "lodash/uniq";
import getSetlists from "./setlistfm";
import dotenv from "dotenv";
dotenv.config();
const { SPOTIFY_CLIENT, SPOTIFY_SECRET } = process.env;

export const callback = async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios({
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      data: {
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://localhost:3000/callback",
        client_id: SPOTIFY_CLIENT,
        client_secret: SPOTIFY_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(SPOTIFY_CLIENT + ":" + SPOTIFY_SECRET).toString(
            "base64"
          ),
      },
    });

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refreshToken;

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

const getTrackUris = (tracks, limit, existingIds) => {
  // If there are more than x tracks, sort by popularity and use the first x
  let uris = [];
  if (tracks.length > limit) {
    uris = uniq(
      tracks.sort(
        (a, b) =>
          b.data.tracks.items[0].popularity - a.data.tracks.items[0].popularity
      )
    )
      .filter(
        (response) =>
          existingIds.indexOf(response.data.tracks.items[0].uri) === -1
      )
      .slice(0, limit)
      .map((response) => response.data.tracks.items[0].uri);
  } else {
    uris = uniq(tracks.map((response) => response.data.tracks.items[0].uri));
  }

  uris = existingIds.concat(uris);

  console.log(
    `Adding ${uniq(uris).length - existingIds.length} tracks to playlist...`
  );
  return uris;
};

const getCurrentUser = async (accessToken) => {
  try {
    return await axios({
      url: `https://api.spotify.com/v1/me`,
      method: "GET",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const createPlaylist = async (req, res) => {
  if (!req.session.accessToken) {
    res.redirect("/login");
    return;
  }
  const {
    data: { id },
  } = await getCurrentUser(req.session.accessToken);

  const { data } = await axios({
    url: `https://api.spotify.com/v1/users/${id}/playlists`,
    method: "POST",
    data: {
      name: req.body.name,
    },
    headers: {
      Authorization: `Bearer ${req.session.accessToken}`,
    },
  });

  res.send(data);
  console.log(`Created playlist ${req.body.name}!`);
};

const addToPlaylist = async (playlistId, uris, accessToken) => {
  await axios({
    url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${uris.join(
      ","
    )}`,
    method: "PUT",
    data: {
      playlistId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log("Added!");
};

const getTracks = async (artistName, tracks, accessToken) => {
  const promises = [];
  tracks.forEach(({ name }) => {
    console.log(`Searching for ${artistName} ${name}`);
    promises.push(
      axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          `${artistName} ${name}`
        )}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
    );
  });

  const results = await Promise.all(promises);

  console.log(`${results.length} results found out of ${promises.length}`);
  return results;
};

export const search = async (req, res) => {
  try {
    const artistName = req.body.artist;
    const playlistId = req.body.playlistId || req.body.playlist;
    console.log(req.body);
    const tracks = await getSetlists(artistName);

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

    const spotifyTracks = await getTracks(
      artistName,
      tracks,
      req.session.accessToken
    );

    const items = await getPlaylistItems(playlistId, req.session.accessToken);
    const existingIds = items.map((i) => i.track.uri);

    const uris = getTrackUris(spotifyTracks, limit, existingIds);

    await addToPlaylist(playlistId, uris, req.session.accessToken);

    res.redirect("/search?success=1");
  } catch (e) {
    console.log(e.message);
    res.send(500);
  }
};

const getPlaylists = async (url, accessToken) => {
  try {
    const { data } = await axios({
      url,
      method: "GET",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return { data };
  } catch (e) {
    throw e;
  }
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
      req.session.accessToken
    );
    allData.push(data.items);

    if (data?.total > 50) {
      const promises = [];
      for (let i = 0; (i + 1) * 50 < data.total; i += 1) {
        promises.push(
          getPlaylists(
            `https://api.spotify.com/v1/users/${id}/playlists?limit=50&offset=${
              (i + 1) * 50
            }`,
            req.session.accessToken
          )
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
