import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';
import RestaurantsController from './controllers/RestaurantsController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/restaurants', RestaurantsController.index);
routes.get('/restaurants/:id', RestaurantsController.show);

routes.post('/restaurants', upload.array('images'), RestaurantsController.create);

routes.patch('/restaurants/:id', upload.array('images'), RestaurantsController.update);

routes.delete('/restaurants/:id', RestaurantsController.delete);

export default routes;