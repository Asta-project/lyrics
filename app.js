const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { songs: null, lyrics: null, error: null });
});

app.post("/search", async (req, res) => {
    const { song } = req.body;
  
    console.log("Searching for:", song);
  
    if (!song) {
      return res.render("index", { songs: null, lyrics: null, error: "No song entered." });
    }
  
    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/spotify-search?q=${encodeURIComponent(song)}`;
      const response = await axios.get(apiUrl);
  
      const songs = response.data; // <-- FIXED
  
      if (!songs || songs.length === 0) {
        return res.render("index", {
          songs: null,
          lyrics: null,
          error: "No results found.",
        });
      }
  
      res.render("index", {
        songs,
        lyrics: null,
        error: null,
      });
    } catch (err) {
      console.error("API Error:", err.message);
      res.render("index", {
        songs: null,
        lyrics: null,
        error: "Error fetching songs from API.",
      });
    }
  });
  

app.get("/lyrics", async (req, res) => {
  const { title } = req.query;

  try {
    const response = await axios.get(`https://kaiz-apis.gleeze.com/api/lyrics?title=${encodeURIComponent(title)}`);
    res.json({
      lyrics: response.data.lyrics,
      thumbnail: response.data.thumbnail,
      fullTitle: response.data.title,
    });
  } catch {
    res.json({ lyrics: "Lyrics not found.", thumbnail: null, fullTitle: title });
  }
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
