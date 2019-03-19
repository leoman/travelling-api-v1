const router = require('express').Router();
const authenticateToken = require('../../auth');
const get = require('lodash').get;
const Post = require('../../models').post;
const Photo = require('../../models').photo;
const Location = require('../../models').location;

const getProperty = (path, object) => get(object, `body.${path}`);
const updateOrReuse = (name, req, object) => get(req, `body.${name}`, object[name]);

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
        order: [
            [ Location, 'duration', 'asc' ],
        ],
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
  router.get('/slug/:slug', (req, res) => {
    Post.findOne({
        where: { slug: req.params.slug },
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
router.post('/', authenticateToken, (req, res) => {
    return Post
        .create({
            title: req.body.title,
            slug: req.body.slug,
            titleColour: req.body.titleColour,
            content: req.body.content,
            date: req.body.date || new Date(),
            photo: req.body.photo,
            location: {
                lat: getProperty(req, 'location.lat'),
                lng: getProperty(req, 'location.lng'),
                name: getProperty(req, 'location.name'),
                duration: getProperty(req, 'location.duration'),
                hideFromBounding: getProperty(req, 'location.hideFromBounding'),
            }
        }, {
            include: [{
                association: Post.location,
            }]
        })
        .then(post => res.status(201).send(post))
        .catch(error => res.status(400).send(error));
});

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
router.put('/:id', authenticateToken, (req, res) => {

    return Post
        .findById(req.params.id, {
            include: [
                { association: Post.location, }
              ]
        })
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
            })
            .then(post => {
                return post.location.updateAttributes({
                    lat: updateOrReuse('location.lat', req, post),
                    lng: updateOrReuse('location.lng', req, post),
                    location: updateOrReuse('location.location', req, post),
                    duration: updateOrReuse('location.duration', req, post),
                    hideFromBounding: updateOrReuse('location.hideFromBounding', req, post),
                })
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
router.delete('/:id', authenticateToken, (req, res, next) => {
    Post.findById(req.params.id).then(function(post){
        if (!post) { return res.sendStatus(401); }
  
        return post.destroy()
            .then(() => res.status(204).send(post))
            .catch((error) => res.status(400).send(error));
    }).catch(next);
});

module.exports = router;