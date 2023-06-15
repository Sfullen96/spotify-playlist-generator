import express from "express";
import sessions from "express-session";
import path from "path";
import bodyParser from "body-parser";
import login from "./login";
import { callback, createPlaylistRequest, getUserPlaylists, search } from "./spotify";

export const PORT = 5000;

const oneDay = 1000 * 60 * 60 * 24;

const app = express();

app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwirsdfsd767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  }),
);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/login", async (req, res) => login(req, res));

app.get("/callback", async (req, res) => callback(req, res));

app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "public", "search.html"));
});

app.post("/post-search", async (req, res) => search(req, res));

app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "public", "create.html"));
});

app.post("/post-create", (req, res) => createPlaylistRequest(req, res));

app.get("/get-playlists", (req, res) => getUserPlaylists(req, res));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
