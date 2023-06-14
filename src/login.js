import dotenv from "dotenv";
dotenv.config();
const { SPOTIFY_CLIENT, SPOTIFY_SECRET } = process.env;

const login = async (req, res) => {
  const scopes = [
    "user-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-collaborative",
    "user-read-email",
    "playlist-read-private",
  ];
  res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT}&scope=${encodeURIComponent(
      scopes.join(" ")
    )}&redirect_uri=http://localhost:3000/callback&state=`
  );
};

export default login;
