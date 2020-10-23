import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';
import RestaurantsController from './controllers/RestaurantsController';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/restaurants', RestaurantsController.indexRestaurant);
routes.get('/restaurants/:id', RestaurantsController.showRestaurant);

routes.post('/restaurants', upload.array('imagesRestaurant'), RestaurantsController.createRestaurant);
routes.post('/restaurants/:id/products', upload.array('imagesProduct'), RestaurantsController.createProduct)

routes.patch('/restaurants/:id', upload.array('imagesRestaurant'), RestaurantsController.updateRestaurant);

routes.delete('/restaurants/:id', RestaurantsController.deleteRestaurant);

export default routes;