const express = require("express");
const app = express();
const mycon = require("./db");
const cors = require("cors");
const spatialRoute = require("./router/spatial.route");

require("dotenv").config();

const corsOptions = {
  //   origin: ["https://dionwebportal.vercel.app", "http://localhost:5173"],
  origin: ["http://127.0.0.1:5500"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

// mycon.query();

app.use("/spatial", spatialRoute);

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("welcome, madame Tonia!");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log("server error", err);
  } else {
    console.log(`check running server on url http://localhost:${PORT}`);
  }
});
