const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const parser = bodyparser.json();
const panSchema = require("../models/rls");
router.get("/", async (req, res) => {
  try {
    const prem = await panSchema.find();
    res.json(prem);
  } catch (err) {
    res.send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const rec = await panSchema.findById(req.params.id);
    res.json(rec);
  } catch (err) {
    res.send(err);
  }
});
router.patch("/:id", async (req, res) => {
  try {
    console.log("Patch");
    const rec = await panSchema.findById(req.params.id);
    rec.password = req.body.password;
    const l = await rec.save();
    res.json(l);
  } catch (e) {}
});
router.delete("/:id", async (req, res) => {
  try {
    //console.log("Delete");
    const rec = await panSchema.findById(req.params.id);
    const l = await rec.remove();
    res.json(l);
  } catch (err) {
    res.send(err);
  }
});
router.post("/", parser, async (req, res) => {
  const data = new panSchema({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phoneno: req.body.phoneno,
  });
  try {
    console.log("name");
    console.log(req.body.name);
    const r = await data.save();
    res.json(r);
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
