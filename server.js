const express = require("express");
const path = require("path");
const cors = require("cors");
const got = require("got");
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.static(__dirname + "/dist/flash-app"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/flash-app/index.html"));
});

app.get("/dict", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "http://localhost:4200");

  console.log("Connect to Jisho API. query:", req.query);

  const { data } = await got
    .get(`https://jisho.org/api/v1/search/words?keyword=${req.query.keyword}`)
    .json();
  res.json(data);
});


app.listen(process.env.PORT || PORT, () => console.log(`server running on port ${PORT}`));

