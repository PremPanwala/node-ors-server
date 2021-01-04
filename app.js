var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  cookieParser = require("cookie-parser"),
  LocalStrategy = require("passport-local"),
  flash = require("connect-flash"),
  User = require("./models/User"),
  session = require("express-session"),
  methodOverride = require("method-override");
var cors = require("cors");
require("dotenv").config();

var //commentRoutes = require("./routes/comments"),
  //campgroundRoutes = require("./routes/campgrounds"),
  //indexRoutes = require("./routes/index");
  demo = require("./routes/demo");

mongoose.connect(
  "mongodb+srv://PREM:prem0131@cluster0-9rlmb.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
const con = mongoose.connection;

mongoose.set("useCreateIndex", true);
app.use(cors());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
app.use("/demo", demo);

app.listen(5000, process.env.IP, function () {
  console.log("The YelpCamp Server Has Started!" + process.env.PORT);
});
