var router = require('express').Router();
const Photo = require('../../models').photo;
const Location = require('../../models').location;

router.get('/', (req, res) => {
    Photo.findAll()
    .then(photos => res.status(201).send(photos))
    .catch(error => res.status(400).send(error));
});

router.post('/:id', async (req, res) => {
    const location = await Location.findById(req.params.id);
        
    const photo = await Photo.create({
        url: req.body.url,
    });
           
    await location.addPhotos(photo);
    
    return res.status(201).send(location);
});

module.exports = router;