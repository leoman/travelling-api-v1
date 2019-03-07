var router = require('express').Router();
const Photo = require('../../models').photo;
const Post = require('../../models').post;

router.get('/', (req, res) => {
    Photo.findAll()
    .then(photos => res.status(201).send(photos))
    .catch(error => res.status(400).send(error));
});

router.post('/:id', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
            
        const photo = await Photo.create({
            url: req.body.url,
        });
            
        await post.addPhotos(photo);
        
        return res.status(201).send(post);
    } catch (error) {
        return res.status(400).send(error);
    }
});

module.exports = router;