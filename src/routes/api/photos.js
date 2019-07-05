import express from 'express';
import authenticateToken from '../../auth';
import Models from '../../models';

const Photo = Models.photo;
const Post = Models.post;

let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Photos
 *   description: Photo management
 */

/**
 * @swagger
 * /api/photos:
 *   get:
 *     description: Returns photos
 *     tags:
 *      - Photos
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: photos
 */
router.get('/', authenticateToken, (req, res) => {
    Photo.findAll()
    .then(photos => res.status(201).send(photos))
    .catch(error => res.status(400).send(error));
});

/**
 * @swagger
 * /api/photos/:id:
 *   post:
 *     description: Add photos to a post
 *     tags:
 *      - Photos
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: photos
 */

router.post('/:id', authenticateToken, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        const photos = [req.body.photo];

        const addPhotos = async (photos, post) => {

            const photoObjects = await photos.map(async photo => {
                return await Photo.create({
                    url: photo,
                });
            });
            
            return Promise.all(photoObjects).then((completed) => {
                return post.addPhotos(completed);
            });
        }

        const postObject = await addPhotos(photos, post);
        
        return res.status(201).send(postObject);
    } catch (error) {
        return res.status(400).send(error);
    }
});

router.delete('/:id', authenticateToken, (req, res, next) => {
    Photo.findById(req.params.id).then(function(photo){
        if (!photo) { return res.sendStatus(401); }

        return photo.destroy()
            .then(() => res.status(200).send({success: true, message: 'Deleted'}))
            .catch((error) => res.status(400).send(error));
    }).catch(next);
});

export default router;