require("dotenv").config();
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
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const port = process.env.PORT || 5000;
var //commentRoutes = require("./routes/comments"),
  //campgroundRoutes = require("./routes/campgrounds"),
  //indexRoutes = require("./routes/index");
  demo = require("./routes/demo");
  const options = {
    swaggerDefinition: {
      info: {
        title: "demo API",
        version: "1.0.0",
      },
      servers: ["https://node-ors-server.herokuapp.com/"]
    },
    apis: ["./routes/demo.js"],
  };

const specs = swaggerJsDoc(options);
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const con = mongoose.connection;

mongoose.set("useCreateIndex", true);
app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));
app.use("/demo", demo);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, process.env.IP, function () {
  console.log("The YelpCamp Server Has Started!" + port);
});
