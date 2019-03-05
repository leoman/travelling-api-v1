var router = require('express').Router();
const Post = require('../../models').Post;
const Location = require('../../models').Location;

router.get('/', (req, res) => {
    Location.findAll({
        include: [{
            model: Post,
        }]
      })
    .then(locations => res.status(201).send(locations))
    .catch(error => res.status(400).send(error));
});

router.post('/', (req, res) => {
    return Location
      .create({
        slug: req.body.slug,
        lat: req.body.lat,
        lng: req.body.lng,
        location: req.body.location,
        title: req.body.title,
        date: req.body.date || new Date(),
        duration: req.body.duration,
        photo: req.body.photo,
        hideFromBounding: req.body.hideFromBounding,
      })
      .then(location => res.status(201).send(location))
      .catch(error => res.status(400).send(error));
});

router.put('/:id', function(req, res, next) {

    return Location
        .findById(req.params.id)
        .then(location => {
            if (!location) {
                return res.status(404).send({
                    message: 'Location Not Found',
                });
            }
        return location
            .update({
                slug: req.body.slug || location.slug,
                lat: req.body.lat || location.lat,
                lng: req.body.lng || location.lng,
                location: req.body.location || location.location,
                title: req.body.title || location.title,
                date: req.body.date || location.date,
                duration: req.body.duration || location.duration,
                photo: req.body.photo || location.photo,
                hideFromBounding: req.body.hideFromBounding || location.hideFromBounding,
            })
            .then(location => res.status(200).send(location))
            .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));

});

router.delete('/:id', function(req, res, next) {
    Location.findById(req.params.id).then(function(location){
        if (!location) { return res.sendStatus(401); }
  
        return location.destroy()
            .then(() => res.status(204).send(location))
            .catch((error) => res.status(400).send(error));
    }).catch(next);
  });

module.exports = router;