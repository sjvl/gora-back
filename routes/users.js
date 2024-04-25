var express = require('express');
var router = express.Router();
require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// /* GET users listing. */
// router.get('/', function(req, res) {
//   User.find({}).then(data => {
// 		res.json({ result: true, users: data });
// 	});
 
// });

/* POST create and login new user */
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['userName', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

// Check if the user has not already been registered
User.findOne({ userName: req.body.userName }).then(data => {
  if (data === null) {
    const hash = bcrypt.hashSync(req.body.password, 10);

    const newUser = new User({
      userName: req.body.userName,
      password: hash,
      token: uid2(32),
      space: []
    });

    newUser.save().then(data => {
      res.json({ result: true, token: data.token, id: data._id, createdSpaces: data.createdSpace, visitedSpaces: data.visitedSpace });
    });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});


/* POST login existing user */
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['userName', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ userName: req.body.userName }).populate('createdSpace').populate('visitedSpace').then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, id: data._id, createdSpaces: data.createdSpace, visitedSpaces: data.visitedSpace });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});


module.exports = router;