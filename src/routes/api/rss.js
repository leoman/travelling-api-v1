import express from 'express';
import RSS from 'rss';
import Models from '../../models';

const Post = Models.post;
const Location = Models.location;

let router = express.Router();


router.get('/', (req, res) => {

  const url = 'http://kirstyandpete.com';

  const where = { status: 'live' };

  Post.findAll({
    where: where,
    order: [
        [ Location, 'duration', 'asc' ],
    ],
    include: [
        {
            model: Location,
        },
    ],
    limit: 20
  })
  .then(posts => {

    const feed = new RSS({
      title: 'Kirsty and Petes Travel adventure',
      feed_url: `${url}/rss.xml`,
      site_url: url,
      managingEditor: 'Peter Mansell',
      copyright: '2019 Peter Mansell',
      language: 'en',
      categories: ['Travel','Adventure'],
    });

    posts.forEach(post => {
      feed.item({
        title:  post.title,
        description: post.content,
        url: `${url}/posts/${post.slug}`,
        date: post.createdAt,
        lat: post.location.lat,
        long: post.location.lng
      });
    });

    const xml = feed.xml({indent: true});

    res.status(200).send(xml);

  })
  .catch(error => res.status(400).send(error));
});

export default router;