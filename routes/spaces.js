var express = require('express');
var router = express.Router();
require('../models/connection');
const Space = require('../models/spaces');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

/* GET spaces listing. */
router.get('/', function(req, res) {
  Space.find({}).then(data => {
		res.json({ result: true, spaces: data });
	});
});

/* GET space by id. */
router.get('/:id', function(req, res) {
	Space.find({_id: req.params.id})
	.then(data => {
		res.json({ result: true, space: data });
  	})
	.catch(error => {
	res.json({ result: false, error: error.message });
	});
});

/* POST create new space */
router.post('/new', (req, res) => {
	if (!checkBody(req.body, ['token', 'spaceName'])) {
	  res.json({ result: false, error: 'Missing or empty fields' });
	  return;
	}
	let newSpace;
	User.findOne({token: req.body.token})
	.then( data => {
		newSpace = new Space({
			name: req.body.spaceName,
			admin: [data._id],
			ground: '/floor.png',
			foreground: '/foreground.png',
			walls: '/walls.json',
		});
		newSpace.save()
		.then(newDoc => {
			User.updateOne( {token: req.body.token}, {$push: {createdSpace: newDoc._id}} )
			.then(data => res.json({ result: true, space: newDoc }))
			
		})
	})
});

/* POST update space */
router.post('/update', (req, res) => {
	if (!checkBody(req.body, ['token','_id'])) {
		res.json({ result: false, error: 'Missing or empty fields' });
		return;
	}

	let update = {};
	if(req.body.ground){update.ground = req.body.ground};
	if(req.body.foreground){update.foreground = req.body.foreground};
	if(req.body.walls){update.walls = req.body.walls};

	Space.updateOne( {_id: req.body._id}, update )
	.then( data => res.json({ result: true, data }) )
});

/* POST delete space */
router.post('/trash', (req, res) => {
	if (!checkBody(req.body, ['token', '_id'])) {
	  res.json({ result: false, error: 'Missing or empty fields' });
	  return;
	}
	Space.deleteOne({ _id: req.body._id })
    .then(spaceDeleteResult => {
      return User.updateOne({ token: req.body.token }, { $pull: { createdSpace: req.body._id } });
    })
    .then(userUpdateResult => {
      res.json({ result: true, message: 'Document deleted and user updated successfully' });
    })
    .catch(error => {
      res.status(500).json({ result: false, error: error.message });
    });
});


module.exports = router;
