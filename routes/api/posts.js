var router = require('express').Router();
const Post = require('../../models').post;
const Photo = require('../../models').photo;
const Location = require('../../models').location;

 /**
   * @swagger
   * definitions:
   *   Login:
   *     required:
   *       - username
   *       - password
   *     properties:
   *       username:
   *         type: string
   *       password:
   *         type: string
   *       path:
   *         type: string
   */

/**
   * @swagger
   * tags:
   *   name: Posts
   *   description: Post management
   */

/**
   * @swagger
   * /api/posts:
   *   get:
   *     description: Returns posts
   *     tags:
   *      - Posts
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: posts
   */
router.get('/', (req, res) => {
    Post.findAll({
        include: [
            {
                model: Location,
            },
            {
                model: Photo,
            }
        ]
      })
    .then(posts => res.status(201).send(posts))
    .catch(error => res.status(400).send(error));
});

/**
   * @swagger
   * /api/posts:
   *   post:
   *     description: Adds a new post
   *     tags: [Posts]
   *     produces:
   *       - application/json
   *     parameters:
   *       - $ref: '#/parameters/username'
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: posts
   */
router.post('/', (req, res) => {
    return Post
        .create({
            title: req.body.title,
            slug: req.body.slug,
            titleColour: req.body.titleColour,
            content: req.body.content,
            date: req.body.date || new Date(),
            photo: req.body.photo,
            location: {
                lat: req.body.lat,
                lng: req.body.lng,
                name: req.body.name,
                duration: req.body.duration,
                hideFromBounding: req.body.hideFromBounding,
            }
        }, {
            include: [{
                association: Post.location,
            }]
        })
        .then(post => res.status(201).send(post))
        .catch(error => res.status(400).send(error));
});

router.put('/:id', function(req, res, next) {

    return Post
        .findById(req.params.id)
        .then(post => {
            if (!post) {
                return res.status(404).send({
                    message: 'Post Not Found',
                });
            }
        return post
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
            .then(post => res.status(200).send(post))
            .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));

});

router.delete('/:id', function(req, res, next) {
    Post.findById(req.params.id).then(function(post){
        if (!post) { return res.sendStatus(401); }
  
        return post.destroy()
            .then(() => res.status(204).send(post))
            .catch((error) => res.status(400).send(error));
    }).catch(next);
  });

module.exports = router;