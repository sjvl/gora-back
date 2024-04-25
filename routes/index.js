var express = require('express');
var router = express.Router();

const uniqid = require('uniqid');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST upload image on cloudinary. */
router.post('/upload', async (req, res) => {
  try {
    const { imageDataUrl } = req.body;

    // Upload image to Cloudinary directly from data URL
    const result = await cloudinary.uploader.upload(imageDataUrl, {
      resource_type: 'image'
    });

    // Return the URL of the uploaded image
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Erreur lors de l\'upload de l\'image.');
  }
});

module.exports = router;
