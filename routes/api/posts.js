const router = require('express').Router();
const get = require('lodash').get;
const Post = require('../../models').post;
const Photo = require('../../models').photo;
const Location = require('../../models').location;

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
   * /api/posts/:id:
   *   get:
   *     description: Returns a single post
   *     tags:
   *      - Posts
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: posts
   */
router.get('/:id', (req, res) => {
    Post.findById(req.params.id, {
        include: [
            {
                model: Location,
            },
            {
                model: Photo,
            }
        ]
      })
    .then(post => res.status(201).send(post))
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
   *       - name: title
   *         description: Posts Title.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: slug
   *         description: Posts url slug.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: titleColour
   *         description: The Title colour used on the post page
   *         in: formData
   *         type: string
   *       - name: content
   *         description: The blog posts markdown content
   *         in: formData
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

const updateOrReuse = (name, req, object) => get(req, `body.${name}`, object[name]);

/**
   * @swagger
   * /api/posts:
   *   put:
   *     description: Update a post
   *     tags:
   *      - Posts
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: posts
   */
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
                title: updateOrReuse('title', req, post),
                slug: updateOrReuse('slug', req, post),
                titleColour: updateOrReuse('titleColour', req, post),
                content: updateOrReuse('content', req, post),
                date: updateOrReuse('date', req, post),
                photo: updateOrReuse('photo', req, post),
                location: {
                    lat: updateOrReuse('lat', req, post),
                    lng: updateOrReuse('lng', req, post),
                    name: updateOrReuse('name', req, post),
                    duration: updateOrReuse('duration', req, post),
                    hideFromBounding: updateOrReuse('hideFromBounding', req, post),
                }
            })
            .then(post => res.status(200).send(post))
            .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));

});

/**
   * @swagger
   * /api/posts:
   *   delete:
   *     description: Delete a post
   *     tags:
   *      - Posts
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: posts
   */
router.delete('/:id', function(req, res, next) {
    Post.findById(req.params.id).then(function(post){
        if (!post) { return res.sendStatus(401); }
  
        return post.destroy()
            .then(() => res.status(204).send(post))
            .catch((error) => res.status(400).send(error));
    }).catch(next);
  });

module.exports = router;