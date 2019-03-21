import express from 'express';
import PostRoutes from './posts';
import PhotoRoutes from './photos';
import AuthRoutes from './auth';
import SchemaValidator from '../../schemas/schemaValidator';

const validateRequest = SchemaValidator(true);
let router = express.Router();

router.use((req, res, next) => {
    validateRequest(req, res, next);
});

router.use('/posts', PostRoutes);
router.use('/photos', PhotoRoutes);
router.use('/auth', AuthRoutes);

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

export default router;