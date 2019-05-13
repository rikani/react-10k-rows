const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', function(req, res, next) {
  fs.readFile(path.join(__dirname, '../data/data.json'), (err, data) => {
    if (err) return next(err);
    let list = JSON.parse(data);
    res.json(list);
  });
});

module.exports = router;
