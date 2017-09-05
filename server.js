const express         = require("express");
const bodyParser      = require("body-parser");
const path            = require("path");
const routes          = require("./routes/index");
const morgan          = require("morgan");
const models          = require("./models/index");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan("dev"));

app.use(routes);

app.listen(3000, function() {
  console.log("App is running on localhost:3000");
})
