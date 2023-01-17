const express = require("express");
const path = require("path");
const cors = require("cors");
const got = require("got");
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.static(__dirname + "/dist/flash-app"));

app.get("/", function (req, res) {
  console.log("Received request for index.html");
  res.sendFile(path.join(__dirname + "/dist/flash-app/index.html"));
});

app.get("/dict", async (req, res) => {
  console.log("Received request to connect to Jisho API. query:", req.query);

  res.set("Access-Control-Allow-Origin", "http://localhost:4200");

  const { data } = await got
    .get(`https://jisho.org/api/v1/search/words?keyword=${req.query.keyword}`)
    .json();
  res.json(data);
});

app.get("/test", (req, res) => {
  console.log("Received test request");

  res.json({ candy: "bubble-gum" });
});

app.listen(process.env.PORT || PORT, () =>
  console.log(`server running on port ${PORT}`)
);
