var express = require("express");
const multer = require("multer");
var path = require("path");
let mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User");
var async = require("async");
var nodemailer = require("nodemailer");
const bodyparser = require("body-parser");
const parser = bodyparser.json();
var crypto = require("crypto");
let use = require("../models/i");
let bk = require("../models/book");
let ejs = require("ejs");

let pdf = require("html-pdf");

const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

function randomString() {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = 8;
  var randomstring = "";
  for (var i = 0; i < string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
}

router.post("/user-profile", upload.single("image"), (req, res, next) => {
  console.log("inside user profile");
  console.log(req.body.username);
  console.log(req.body.email);
  console.log(req.body.phoneno);
  console.log(req.body.itemname);
  console.log(req.body.itemdetail);
  console.log(req.body.rent);
  console.log(req.body.fine);
  console.log(req.body.image);
  const url = req.protocol + "://" + req.get("host");
  const user = new use({
    _id: new mongoose.Types.ObjectId(),
    oid: req.body.oid,
    username: req.body.username,
    email: req.body.email,
    phoneno: req.body.phoneno,
    itemname: req.body.itemname,
    itemdetail: req.body.itemdetail,
    rent: req.body.rent,
    fine: req.body.fine,
    image: req.body.image,
  });
  user
    .save()
    .then((result) => {
      res.status(201).json({
        message: "User registered successfully!",
        userCreated: {
          //  _id: result._id,
          image: result.image,
        },
      });
    })
    .catch((err) => {
      console.log(err),
        res.status(500).json({
          error: err,
        });
    });
});

router.post("/book", async (req, res, next) => {
  let f = 0;

  console.log("inside book");
  // console.log(req.body.cid2);
  // console.log(req.body.oid2);
  // console.log(req.body.pid2);
  // console.log(req.body.name2);
  // console.log(req.body.phoneno2);
  // console.log(req.body.email2);
  // console.log(req.body.itemname2);
  console.log(req.body.image2);
  // console.log(req.body.to);
  // console.log(req.body.total);
  // console.log(req.body.is_active);
  const user = new bk({
    _id: new mongoose.Types.ObjectId(),
    cid: req.body.cid2,
    pid: req.body.pid2,
    oid: req.body.oid2,
    name: req.body.name2,
    phoneno: req.body.phoneno2,
    email: req.body.email2,
    from: req.body.from,
    itemname: req.body.itemname2,
    image: req.body.image2,
    fine: req.body.fine2,
    to: req.body.to,
    total: req.body.total,
    is_active: req.body.is_active,
  });

  console.log(req.body.pid2);
  console.log("In MYBOOKING");
  const Users = await bk.find({ pid: req.body.pid2 });
  //console.log(Users);
  Users.map((x) => {
    let fromdb = x.from;
    let todb = x.to;

    let fromUser = req.body.from;
    let toUser = req.body.to;

    fromUser = new Date(fromUser);
    toUser = new Date(toUser);

    fromdb = new Date(fromdb);
    todb = new Date(todb);

    if (
      (fromUser <= fromdb && toUser >= fromdb) ||
      (fromUser >= fromdb && fromUser <= todb)
    ) {
      console.log("cant rent");
      f = 1;
    }
  });

  console.log(f);
  if (f === 0) {
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User registered successfully!",
          userCreated: {
            //  _id: result._id,
            //image: result.image,
          },
        });
      })
      .catch((err) => {
        console.log(err),
          res.status(500).json({
            error: err,
          });
      });
  } else {
    res.status(404).json({
      message: "product is already booked",
      userCreated: {
        //  _id: result._id,
        //image: result.image,
      },
    });
  }
});

router.post("/show", (req, res) => {
  console.log("In SHow");
  use.find().exec((err, Users) => {
    console.log(use);
    if (err) return res.status(400).json({ success: false, err });

    res.status(200).json({ success: true, Users });
  });
});

router.post("/mybook/:oid2", (req, res) => {
  console.log(req.params.oid2);
  console.log("In MYBOOKING");
  bk.find({ oid: req.params.oid2, is_active: "true" }).exec((err, Users) => {
    console.log(bk);
    if (err) return res.status(400).json({ success: false, err });

    res.status(200).json({ success: true, Users });
  });
});
router.post("/history/:ownerid", (req, res) => {
  console.log("HI bro this is history system");
  console.log(req.params.ownerid);
  bk.find({ cid: req.params.ownerid, is_active: "false" }).exec(
    (err, Users) => {
      console.log(bk);
      if (err) return res.status(400).json({ success: false, err });

      res.status(200).json({ success: true, Users });
    }
  );
});
router.post("/change/", (req, res) => {
  console.log("In Change");
  console.log("HI bRO");
  console.log("email", req.body.email);
  console.log("_id", req.body._id);
  console.log("final amount", req.body.bill);
  console.log("Rent", req.body.total);
  console.log("Fine", req.body.fine);
  console.log("name", req.body.name);
  console.log("phoneno", req.body.phoneno);
  console.log("from", req.body.ffrom);
  console.log("itemname", req.body.itemname);
  console.log("to", req.body.to);
  var f = 0;
  let students = [
    {
      _id: req.body._id,
      name: req.body.name,
      bill: req.body.bill,
      phoneno: req.body.phoneno,
      ffrom: req.body.ffrom,
      itemname: req.body.itemname,
      to: req.body.to,
      email: req.body.email,
      total: req.body.total,
      fine: req.body.fine,
    },
  ];
  console.log(path.join(__dirname, "../views/", "report-template.ejs"));
  ejs.renderFile(
    path.join(__dirname, "../views/", "report-template.ejs"),
    {
      students: students,
    },
    (err, data) => {
      if (err) {
        console.log(err);
        //res.send(err);
      } else {
        let options = {
          height: "11.25in",
          width: "8.5in",
          header: {
            height: "20mm",
          },
          footer: {
            height: "20mm",
          },
        };

        pdf.create(data, options).toFile("prem.pdf", function (err, data) {
          if (err) {
            //  res.send(err);
          } else {
            //  res.send("File created successfully");
            //  f = 1;
          }
        });
      }
    }
  );

  console.log("HI This is email:", req.body.email);
  console.log("HI This is bill amount:", req.body.bill);
  console.log("In CHANGE");
  bk.updateOne({ _id: req.body._id }, { $set: { is_active: "false" } }).exec(
    (err, Users) => {
      console.log(bk);
      if (err) return res.status(400).json({ success: false, err });

      res.status(200).json({ success: true, Users });
    }
  );
  var f = 0;
  setTimeout(() => {
    console.log("AAPNE BULAYA");
    if (f === 0) {
      f = 1;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        port: 25,
        secure: false,
        auth: {
          user: "digi5technologies@gmail.com",
          pass: "Digi5vgec@2021",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      //console.log();
      console.log(
        "This is path console",
        path.join(__dirname, "../", "prem.pdf")
      );
      transporter.sendMail({
        from: "digi5technologies@gmail.com",
        to: req.body.email,
        subject: "An Attached File",
        text: "Check out this attached pdf file",
        attachments: [
          {
            filename: "prem.pdf",
            path: path.join(__dirname, "../", "prem.pdf"),
            contentType: "application/pdf",
          },
        ],
        function(err, info) {
          if (err) {
            console.log(err);
            //  res.send(err);
          } else {
            console.log("SUCCESS");

            //res.send(info);
          }
        },
      });
    }
  }, 2 * 1000);
});
router.post("/show1/:oname", (req, res) => {
  console.log("HI I AM THERE");
  console.log(req.params.oname);
  User.findOne({ email: req.params.oname }).exec((err, Users) => {
    console.log(User);
    if (err) return res.status(400).json({ success: false, err });

    res.status(200).json({ success: true, Users });
  });
});
router.post("/show2/:pid2", (req, res) => {
  console.log("HI I AM THERE2");
  console.log(req.params.pid2);
  use.findOne({ _id: req.params.pid2 }).exec((err, user) => {
    console.log(user);
    if (err) return res.status(400).json({ success: false, err });

    res.status(200).json({ success: true, user });
  });
});

router.post("/login", function (req, res, next) {
  var username = req.body.email;
  var password = req.body.password;

  var check = User.findOne({ email: username });
  check.exec((err, data) => {
    if (err) {
      var error = {
        is_error: true,
        message: err.message,
      };
      return res.status(500).send(error);
    } else {
      if (data == null) {
        var error = {
          is_error: true,
          message: "Username or Password invalid",
        };
        console.log("IN LOGIN UNSUCESS");
        return res.status(500).send(error);
      } else {
        var check_pass = data.password;
        if (password === check_pass) {
          //  var token = data.generateAuthToken();
          delete data.password;
          var finaldata = {
            data: data,
            is_error: false,
            message: "Sign in Successful",
          };
          console.log("IN LOGIN SUCCESS");
          return res.status(200).send(finaldata);
        } else {
          var error = {
            is_error: true,
            message: "Username or Password invalid",
          };
          console.log("IN LOGIN UNSUCESS");
          return res.status(500).send(error);
        }
      }
    }
  });
  console.log("IN LOGIN API");
});
router.post("/send", (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 25,
    secure: false,
    auth: {
      user: "digi5technologies@gmail.com",
      pass: "Digi5vgec@2021",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"digi5technologies@gmail.com" <your@email.com>', // sender address
    to: "prempanwala710@gmail.com,jaygajjar052@gmail.com", // list of receivers
    subject: "Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      //return console.log(error);
      res.status(200).send("false");
    } else {
      res.status(200).send("true");
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // res.render("contact", { msg: "Email has been sent" });
  });
});

router.post("/register", parser, async (req, res) => {
  console.log("Request ARRIVED");
  const data = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phoneno: req.body.phoneno,
  });
  try {
    console.log("name");
    console.log(req.body.username);
    const r = await data.save();
    //res.json(r);
    r.exec((err, data) => {
      if (err) {
        var error = {
          is_error: true,
          message: err.message,
        };
        return res.status(500).send(error);
      } else {
        var error = {
          is_error: false,
          message: err.message,
        };
        return res.status(500).send(error);
      }
    });
  } catch (e) {
    res.send(e);
  }
});

router.post("/forgot_pass", function (req, res, next) {
  var username = req.body.email;
  console.log(username);
  var check = User.findOne({ email: username });
  check.exec((err, data) => {
    if (err) {
      var error = {
        is_error: true,
        message: err.message,
      };
      return res.status(500).send(error);
    } else if (data == null) {
      var error = {
        is_error: true,
        message: "Email is not valid",
      };
      return res.status(500).send(error);
    } else {
      console.log("Else ma avi gayo");
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "digi5technologies@gmail.com",
          pass: "Digi5vgec@2021",
        },
      });

      var new_pass = randomString();
      var msg =
        "Dear user,\n Your password for Rental Website has been changed to " +
        new_pass +
        "." +
        "\n Please update your password by using above crredentails and choose storng password!!" +
        "\n Thank You!!!";
      var mailOptions = {
        from: "digi5technologies@gmail.com",
        to: data.email,
        subject: "Rental Website Forgot Password",
        text: msg,
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          var error = {
            is_error: true,
            message: err.message,
          };
          return res.status(500).send(error);
        } else {
          console.log(new_pass);
          //    new_pass = bcrypt.hashSync(new_pass, 10);
          console.log(new_pass);
          var update = User.findByIdAndUpdate(
            { _id: data._id },
            { password: new_pass }
          );
          update.exec((err, data) => {
            if (err) {
              var error = {
                is_error: true,
                message: err.message,
              };
              return res.status(500).send(error);
            } else {
              var finaldata = {
                is_error: false,
                message: "Password send to your email id",
              };
              return res.status(200).send(finaldata);
            }
          });
        }
      });
    }
  });
});
module.exports = router;
