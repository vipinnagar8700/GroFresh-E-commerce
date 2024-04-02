const express = require("express");
const app = express();
require("dotenv/config");
const cors = require("cors");
const userRoutes = require("../Routes/UserRouter");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dbConnect = require("../config/db");
const path = require('path');



app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
dbConnect();
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log("Request received:", req.method, req.url);
  next();
});

app.set('view engine', 'ejs');
app.set('Views', path.join(__dirname, 'Views'));

app.get("/", (req, res) => {
  res.render('index')
});





app.use("/api", userRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Mr Vipin Your Server is Running on port ${port}`);
});
